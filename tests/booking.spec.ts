import { test } from '@playwright/test';
import { BookingPage, BookingData } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';

test.describe('Booking', () => {
  let bookingPage: BookingPage;
  let confirmationPage: BookingConfirmationPage;

  const bookingData: BookingData = {
    name: 'Анна',
    phone: '+79991234567',
    date: '2026-09-10',
    time: '14:00',
    guests: '4',
  };

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    confirmationPage = new BookingConfirmationPage(page);

    await bookingPage.open();
  });

  test('TC-01: successful booking with valid data', async () => {
    await test.step('Create booking with valid data', async () => {
      await bookingPage.createBooking(bookingData);
    });

    await test.step('Verify booking confirmation', async () => {
      await confirmationPage.expectVisible();
      await confirmationPage.expectBookingData(bookingData);
    });
  });

  test('TC-02: validation errors are shown for all required fields', async () => {
    await test.step('Submit empty booking form', async () => {
      await bookingPage.submit();
    });

    await test.step('Verify validation errors for all required fields', async () => {
      await bookingPage.expectErrors({
        name: 'Укажите имя',
        phone: 'Укажите номер телефона',
        date: 'Укажите дату',
        time: 'Выберите время',
        guests: 'Укажите количество гостей',
      });
    });
  });

  test('TC-11: invalid phone country code should show validation error', async () => {
    await test.step('Enter phone number with invalid country code', async () => {
      await bookingPage.setField('phone', '+39991234567');
      await bookingPage.blur('phone');
    });

    await test.step('Verify phone validation error', async () => {
      await bookingPage.expectError(
        'phone',
        'Введите номер в формате +7XXXXXXXXXX или 8XXXXXXXXXX',
      );
    });
  });

  test('TC-16: time slots from 12:00 to 22:00 should be available', async () => {
    await test.step('Verify available time slots from 12:00 to 22:00', async () => {
      for (let hour = 12; hour <= 22; hour++) {
        await bookingPage.expectTimeSlot(`${hour}:00`);
      }
    });
  });

  test('TC-24: booking form should be cleared after clicking Book Again', async () => {
    await test.step('Create booking with valid data', async () => {
      await bookingPage.createBooking(bookingData);
    });

    await test.step('Click Book Again', async () => {
      await confirmationPage.clickBookAgain();
    });

    await test.step('Verify booking form is cleared', async () => {
      await bookingPage.expectFormCleared(bookingData);
    });
  });
});