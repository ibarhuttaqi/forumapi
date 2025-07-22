const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  const fakeIdGenerator = () => '123';

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const result = await repository.addThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(result).toStrictEqual(new AddedThread({ id: 'thread-123', title: 'title', owner: 'user-123' }));
    });
  });

  describe('addComment', () => {
    it('should persist comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const result = await repository.addComment({
        content: 'comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(result).toStrictEqual(new AddedComment({ id: 'comment-123', content: 'comment', owner: 'user-123' }));
    });
  });

  describe('verifyAvailableThread', () => {
    it('should resolve successfully when thread exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyAvailableThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyAvailableThread('not-found')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentInThread', () => {
    it('should resolve successfully when comment exists in thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyCommentInThread('comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when comment does not exist in thread', async () => {
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyCommentInThread('comment-xxx', 'thread-xxx')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyCommentOwner('not-exist', 'user-123')).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyCommentOwner('comment-123', 'user-xxx')).rejects.toThrow(AuthorizationError);
    });

    it('should resolve when user is the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment successfully', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await repository.deleteComment('comment-123');

      const [comment] = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment.is_deleted).toBe(true);
    });

    it('should throw NotFoundError if comment does not exist', async () => {
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.deleteComment('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDetailThread', () => {
    it('should return correct thread detail', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'title', body: 'body', owner: 'user-123' });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const result = await repository.getDetailThread('thread-123');

      expect(result).toBeInstanceOf(DetailThread);
      expect(result.id).toBe('thread-123');
      expect(result.title).toBe('title');
      expect(result.body).toBe('body');
      expect(result.username).toBe('john');
      expect(result.date).toBeInstanceOf(Date);
    });

    it('should throw NotFoundError if thread not found', async () => {
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await expect(repository.getDetailThread('not-found')).rejects.toThrow(NotFoundError);
    });
  });

  // describe('getCommentsByThreadId', () => {
  //   it('should return list of comments with all correct fields and values', async () => {
  //     await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
  //     await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  //     await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123', content: 'content', owner: 'user-123', isDelete: false });
  //     await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123', content: 'deleted', owner: 'user-123', isDelete: true });

  //     const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
  //     const result = await repository.getCommentsByThreadId('thread-123');

  //     expect(result).toHaveLength(2);

  //     expect(result[0]).toEqual({
  //       id: 'comment-1',
  //       username: 'john',
  //       date: expect.any(Date),
  //       content: 'content',
  //       is_deleted: false,
  //     });

  //     expect(result[1]).toEqual({
  //       id: 'comment-2',
  //       username: 'john',
  //       date: expect.any(Date),
  //       content: 'deleted',
  //       is_deleted: true,
  //     });
  //   });
  // });

  describe('getCommentsByThreadId', () => {
    it('should return list of comments including soft-deleted ones', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-1', 
        threadId: 'thread-123', 
        content: 'content', 
        owner: 'user-123', 
        is_deleted: false
      });
      await CommentsTableTestHelper.addComment({ 
        id: 'comment-2', 
        threadId: 'thread-123', 
        content: 'deleted', 
        owner: 'user-123', 
        is_deleted: true
      });

      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const result = await repository.getCommentsByThreadId('thread-123');

      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        id: 'comment-1',
        username: 'john',
        date: expect.any(Date),
        content: 'content',
        is_deleted: false,
      });
      
      expect(result[1]).toEqual({
        id: 'comment-2',
        username: 'john',
        date: expect.any(Date),
        content: 'deleted',
        is_deleted: true,
      });
    });
  });
});
