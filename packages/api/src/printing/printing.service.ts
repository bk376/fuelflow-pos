import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as escpos from 'escpos';
// Note: In production, you would install escpos: npm install escpos

export interface ReceiptData {
  transactionId: string;
  timestamp: Date;
  cashierName: string;
  locationName: string;
  locationAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
    isFuel?: boolean;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  cardLastFour?: string;
  authCode?: string;
  customerCopy?: boolean;
}

@Injectable()
export class PrintingService {
  private readonly logger = new Logger(PrintingService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Print receipt to thermal printer
   */
  async printReceipt(receiptData: ReceiptData): Promise<boolean> {
    try {
      this.logger.log(`Printing receipt for transaction ${receiptData.transactionId}`);
      
      // In development mode, log receipt instead of printing
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logReceiptToConsole(receiptData);
        return true;
      }

      // Production thermal printer integration
      const receiptText = this.generateReceiptText(receiptData);
      await this.printToThermalPrinter(receiptText);
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to print receipt: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate receipt text content
   */
  private generateReceiptText(data: ReceiptData): string {
    const width = 48; // Standard thermal printer width
    const line = '='.repeat(width);
    const space = ' ';

    let receipt = '';

    // Header
    receipt += this.centerText(data.locationName, width) + '\n';
    receipt += this.centerText(data.locationAddress, width) + '\n';
    receipt += line + '\n';

    // Transaction info
    receipt += `Transaction: ${data.transactionId}\n`;
    receipt += `Date: ${data.timestamp.toLocaleDateString()}\n`;
    receipt += `Time: ${data.timestamp.toLocaleTimeString()}\n`;
    receipt += `Cashier: ${data.cashierName}\n`;
    receipt += line + '\n';

    // Items
    receipt += this.padText('ITEM', 'QTY', 'PRICE', 'TOTAL', width) + '\n';
    receipt += '-'.repeat(width) + '\n';

    data.items.forEach(item => {
      const itemName = item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name;
      
      if (item.isFuel) {
        // Fuel items - show gallons and price per gallon
        receipt += itemName + '\n';
        receipt += this.padText(
          `${item.quantity.toFixed(3)} gal`,
          '',
          `$${item.price.toFixed(3)}/gal`,
          `$${item.total.toFixed(2)}`,
          width
        ) + '\n';
      } else {
        // Regular items
        receipt += this.padText(
          itemName,
          item.quantity.toString(),
          `$${item.price.toFixed(2)}`,
          `$${item.total.toFixed(2)}`,
          width
        ) + '\n';
      }
    });

    receipt += '-'.repeat(width) + '\n';

    // Totals
    receipt += this.padText('', '', 'Subtotal:', `$${data.subtotal.toFixed(2)}`, width) + '\n';
    receipt += this.padText('', '', 'Tax:', `$${data.taxAmount.toFixed(2)}`, width) + '\n';
    receipt += this.padText('', '', 'TOTAL:', `$${data.totalAmount.toFixed(2)}`, width) + '\n';
    receipt += line + '\n';

    // Payment info
    receipt += `Payment: ${data.paymentMethod.toUpperCase()}\n`;
    if (data.cardLastFour) {
      receipt += `Card: ****${data.cardLastFour}\n`;
    }
    if (data.authCode) {
      receipt += `Auth Code: ${data.authCode}\n`;
    }
    receipt += line + '\n';

    // Footer
    receipt += this.centerText('Thank You!', width) + '\n';
    receipt += this.centerText('Please Come Again', width) + '\n';
    
    if (data.customerCopy) {
      receipt += '\n' + this.centerText('*** CUSTOMER COPY ***', width) + '\n';
    }

    // Receipt end
    receipt += '\n\n\n'; // Feed paper

    return receipt;
  }

  /**
   * Print to actual thermal printer (production)
   */
  private async printToThermalPrinter(receiptText: string): Promise<void> {
    // Example thermal printer integration
    // This would connect to actual hardware in production
    
    try {
      const printerPath = this.configService.get('THERMAL_PRINTER_PATH', '/dev/usb/lp0');
      
      // For USB thermal printers
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      device.open(() => {
        printer
          .font('a')
          .align('ct')
          .style('bu')
          .size(1, 1)
          .text(receiptText)
          .cut()
          .close();
      });

    } catch (error) {
      this.logger.error('Thermal printer error:', error);
      throw new Error('Failed to print to thermal printer');
    }
  }

  /**
   * Log receipt to console for development
   */
  private logReceiptToConsole(data: ReceiptData): void {
    const receipt = this.generateReceiptText(data);
    
    console.log('\n' + '='.repeat(50));
    console.log('🧾 THERMAL PRINTER RECEIPT (DEV MODE)');
    console.log('='.repeat(50));
    console.log(receipt);
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Center text within given width
   */
  private centerText(text: string, width: number): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  /**
   * Format text in columns
   */
  private padText(col1: string, col2: string, col3: string, col4: string, width: number): string {
    const col1Width = Math.floor(width * 0.4);
    const col2Width = Math.floor(width * 0.1);
    const col3Width = Math.floor(width * 0.25);
    const col4Width = width - col1Width - col2Width - col3Width;

    return (
      col1.padEnd(col1Width).substring(0, col1Width) +
      col2.padEnd(col2Width).substring(0, col2Width) +
      col3.padStart(col3Width).substring(0, col3Width) +
      col4.padStart(col4Width).substring(0, col4Width)
    );
  }

  /**
   * Print age verification receipt for restricted items
   */
  async printAgeVerificationReceipt(data: {
    transactionId: string;
    customerAge: number;
    idType: string;
    idNumber: string;
    cashierName: string;
    verificationMethod: string;
  }): Promise<boolean> {
    try {
      const timestamp = new Date();
      let receipt = '';

      receipt += this.centerText('AGE VERIFICATION RECEIPT', 48) + '\n';
      receipt += '='.repeat(48) + '\n';
      receipt += `Transaction: ${data.transactionId}\n`;
      receipt += `Date: ${timestamp.toLocaleDateString()}\n`;
      receipt += `Time: ${timestamp.toLocaleTimeString()}\n`;
      receipt += `Cashier: ${data.cashierName}\n`;
      receipt += '-'.repeat(48) + '\n';
      receipt += `Customer Age: ${data.customerAge}\n`;
      receipt += `ID Type: ${data.idType}\n`;
      receipt += `ID Number: ${data.idNumber.replace(/(.{4})/g, '$1-')}\n`;
      receipt += `Verification: ${data.verificationMethod}\n`;
      receipt += '='.repeat(48) + '\n';
      receipt += this.centerText('Age Verification Complete', 48) + '\n';
      receipt += '\n\n';

      if (this.configService.get('NODE_ENV') === 'development') {
        console.log('\n🔞 AGE VERIFICATION RECEIPT:\n', receipt);
      } else {
        await this.printToThermalPrinter(receipt);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to print age verification receipt: ${error.message}`);
      return false;
    }
  }

  /**
   * Test printer connection
   */
  async testPrinter(): Promise<boolean> {
    try {
      const testReceipt: ReceiptData = {
        transactionId: 'TEST-001',
        timestamp: new Date(),
        cashierName: 'Test Cashier',
        locationName: 'Test Gas Station',
        locationAddress: '123 Main St, Test City',
        items: [
          {
            name: 'Regular Unleaded',
            quantity: 10.543,
            price: 3.299,
            total: 34.78,
            isFuel: true
          },
          {
            name: 'Coca-Cola 20oz',
            quantity: 1,
            price: 2.49,
            total: 2.49
          }
        ],
        subtotal: 37.27,
        taxAmount: 2.98,
        totalAmount: 40.25,
        paymentMethod: 'Credit Card',
        cardLastFour: '1234',
        authCode: 'ABC123'
      };

      return await this.printReceipt(testReceipt);
    } catch (error) {
      this.logger.error(`Printer test failed: ${error.message}`);
      return false;
    }
  }
}