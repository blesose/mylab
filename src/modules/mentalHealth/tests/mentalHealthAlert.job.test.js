import Queue from "bull";
import { queueMentalHealthAlert } from "../modules/mentalHealth/jobs/mentalHealthAlert.job.js";
import { sendEmail } from "../utils/emailService.js";

jest.mock("bull");
jest.mock("../utils/emailService.js");

describe("MentalHealth Alert Job", () => {
  let mockQueue;
  let processHandler;

  beforeEach(() => {
    mockQueue = {
      add: jest.fn(),
      process: jest.fn((handler) => {
        processHandler = handler;
      }),
    };
    Queue.mockImplementation(() => mockQueue);
  });

  it("should queue a mental health alert job", async () => {
    const user = { email: "test@example.com", name: "John" };
    await queueMentalHealthAlert(user);

    expect(mockQueue.add).toHaveBeenCalledWith({ user });
  });

  it("should process a job and send email", async () => {
    const user = { email: "test@example.com", name: "John" };
    await processHandler({ data: { user } });

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: expect.stringMatching(/Mental Health Check-In/),
      })
    );
  });
});
