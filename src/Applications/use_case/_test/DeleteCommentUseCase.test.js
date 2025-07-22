const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();

    // Mock dependencies
    mockThreadRepository.verifyCommentInThread = jest.fn()
      .mockResolvedValue();

    mockThreadRepository.verifyCommentOwner = jest.fn()
      .mockResolvedValue();

    mockThreadRepository.deleteComment = jest.fn()
      .mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyCommentInThread)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);

    expect(mockThreadRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockThreadRepository.deleteComment)
      .toBeCalledWith(useCasePayload.commentId);
  });
});
