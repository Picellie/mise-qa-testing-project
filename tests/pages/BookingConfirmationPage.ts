import { expect, Page } from '@playwright/test';
import { BookingData } from './BookingPage';

type ConfirmationField =
  | 'name'
  | 'date'
  | 'time'
  | 'guests';

export class BookingConfirmationPage {
  constructor(private readonly page: Page) {}

  async clickBookAgain(): Promise<void> {
    await this.page.locator('#againBtn').click();
  }

  async expectVisible(): Promise<void> {
    await expect(
      this.page.locator('#confirmScreen')
    ).toBeVisible();
  }

  async expectField(
    field: ConfirmationField,
    expectedValue: string,
  ): Promise<void> {
    await expect(
      this.page.locator(`#c-${field}`)
    ).toHaveText(expectedValue);
  }

  async expectBookingData(
    data: BookingData,
  ): Promise<void> {
    const fields: ConfirmationField[] = [
      'name',
      'date',
      'time',
      'guests',
    ];

    for (const field of fields) {
      await this.expectField(field, data[field]);
    }
  }
}