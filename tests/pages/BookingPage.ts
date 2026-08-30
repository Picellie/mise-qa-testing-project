import { expect, Page } from '@playwright/test';

export type BookingData = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
};

export class BookingPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async setField(
    field: keyof BookingData,
    value: string,
  ): Promise<void> {
    const locator = this.page.locator(`#${field}`);

    if (field === 'time') {
      await locator.selectOption(value);
    } else {
      await locator.fill(value);
    }
  }

  async blur(field: keyof BookingData): Promise<void> {
    await this.page.locator(`#${field}`).blur();
  }

  async fillBookingForm(data: BookingData): Promise<void> {
    for (const [field, value] of Object.entries(data)) {
      await this.setField(
        field as keyof BookingData,
        value,
      );
    }
  }

  async submit(): Promise<void> {
    await this.page.locator('#submitBtn').click();
  }

  async createBooking(data: BookingData): Promise<void> {
    await this.fillBookingForm(data);
    await this.submit();
  }

  async expectError(
    field: keyof BookingData,
    expectedText: string,
  ): Promise<void> {
    await expect(
      this.page.locator(`#err-${field}`),
    ).toHaveText(expectedText);
  }

  async expectErrors(
  errors: Partial<Record<keyof BookingData, string>>,
): Promise<void> {
  for (const [field, message] of Object.entries(errors)) {
    await expect.soft(
      this.page.locator(`#err-${field}`),
      `Validation error for "${field}"`,
    ).toHaveText(message);
  }
}

  async expectFieldValue(
    field: keyof BookingData,
    expectedValue: string,
  ): Promise<void> {
    await expect(
      this.page.locator(`#${field}`),
    ).toHaveValue(expectedValue);
  }

async expectFormCleared(data: BookingData): Promise<void> {
  for (const field of Object.keys(data) as (keyof BookingData)[]) {
    await expect.soft(
      this.page.locator(`#${field}`),
      `Field "${field}" should be empty`,
    ).toHaveValue('');
  }
}

  async expectTimeSlot(time: string): Promise<void> {
    await expect(
      this.page.locator(`#time option[value="${time}"]`),
    ).toHaveCount(1);
  }
}