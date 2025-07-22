const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'This is a comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'This is a comment',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockResolvedValue();

    mockThreadRepository.addComment = jest.fn()
      .mockResolvedValue(new AddedComment({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
      }));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const result = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toBeCalledWith(useCasePayload.threadId);

    expect(mockThreadRepository.addComment)
      .toBeCalledWith(new AddComment(useCasePayload));

    expect(result).toStrictEqual(expectedAddedComment);
  });
});
