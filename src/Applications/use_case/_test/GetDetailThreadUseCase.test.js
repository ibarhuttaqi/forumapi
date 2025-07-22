const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailComment = require('../../../Domains/threads/entities/DetailComment');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    };

    const commentsRaw = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2021-08-08T07:59:33.555Z',
        content: 'first comment',
        is_deleted: false,
      },
      {
        id: 'comment-124',
        username: 'user2',
        date: '2021-08-08T08:00:33.555Z',
        content: 'deleted comment',
        is_deleted: true,
      },
    ];

    const expectedComments = commentsRaw.map((comment) => new DetailComment(comment));
    const expectedResult = {
      ...expectedThread,
      comments: expectedComments,
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockThreadRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentsRaw));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(detailThread).toStrictEqual(expectedResult);
  });
});
