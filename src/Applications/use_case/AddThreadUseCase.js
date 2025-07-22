const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const thread = new AddThread(useCasePayload);

    // console.log(thread);
    // await this._threadRepository.verifyAvailableTitle(thread.title);
    // registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
