import nodemailer from "nodemailer";
import { sendEmail } from "../utils/emailService.js";

jest.mock("nodemailer");

describe("emailService", () => {
  let mockSendMail;

  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue({});
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  it("should send an email successfully", async () => {
    await sendEmail({
      to: "user@example.com",
      subject: "Test Email",
      html: "<p>Hello</p>",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Test Email",
        html: "<p>Hello</p>",
      })
    );
  });

  it("should throw if sending fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));
    await expect(
      sendEmail({
        to: "user@example.com",
        subject: "Error test",
        html: "<p>Fail</p>",
      })
    ).rejects.toThrow("SMTP error");
  });
});
