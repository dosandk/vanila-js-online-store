import { SuccessNotificationMessage } from "./index";

describe("NotificationMessage", () => {
  let notificationMessage;

  beforeEach(() => {
    notificationMessage = new SuccessNotificationMessage('message');

    document.body.append(notificationMessage.element);
  });

  afterEach(() => {
    notificationMessage.destroy();
    notificationMessage = null;
  });

  it("should be rendered correctly", () => {
    expect(notificationMessage.element).toBeVisible();
    expect(notificationMessage.element).toBeInTheDocument();
  });

  it("should be removed after time defined in duration property", () => {
    notificationMessage = new SuccessNotificationMessage('message');

    const removeMethod = jest.spyOn(notificationMessage, 'remove');

    document.body.append(notificationMessage.element);

    // This mocks out any call to setTimeout, setInterval with dummy functions
    jest.useFakeTimers();

    notificationMessage.show();

    // Move the time ahead with 2 second
    jest.advanceTimersByTime(2000);

    expect(removeMethod).toBeCalled();
    expect(removeMethod).toHaveBeenCalledTimes(1);
    expect(notificationMessage.element).not.toBeInTheDocument();
  });

  it("should have ability to set message", () => {
    notificationMessage = new SuccessNotificationMessage('hi');

    expect(notificationMessage.element).toHaveTextContent('hi');
  });

  it('should have ability to be destroyed', () => {
    notificationMessage.destroy();

    expect(notificationMessage.element).not.toBeInTheDocument();
  });
});
