import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrintingService, ReceiptData } from './printing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('printing')
@Controller('printing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrintingController {
  constructor(private readonly printingService: PrintingService) {}

  @Post('receipt')
  @ApiOperation({ summary: 'Print transaction receipt' })
  @ApiResponse({ status: 200, description: 'Receipt printed successfully' })
  @ApiResponse({ status: 400, description: 'Printing failed' })
  async printReceipt(@Body() receiptData: ReceiptData) {
    const success = await this.printingService.printReceipt(receiptData);
    
    return {
      success,
      message: success ? 'Receipt printed successfully' : 'Failed to print receipt',
      transactionId: receiptData.transactionId
    };
  }

  @Post('age-verification')
  @ApiOperation({ summary: 'Print age verification receipt' })
  @ApiResponse({ status: 200, description: 'Age verification receipt printed successfully' })
  async printAgeVerification(@Body() verificationData: {
    transactionId: string;
    customerAge: number;
    idType: string;
    idNumber: string;
    cashierName: string;
    verificationMethod: string;
  }) {
    const success = await this.printingService.printAgeVerificationReceipt(verificationData);
    
    return {
      success,
      message: success ? 'Age verification receipt printed' : 'Failed to print verification receipt',
      transactionId: verificationData.transactionId
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test printer connection' })
  @ApiResponse({ status: 200, description: 'Printer test completed' })
  async testPrinter() {
    const success = await this.printingService.testPrinter();
    
    return {
      success,
      message: success ? 'Printer test successful' : 'Printer test failed',
      timestamp: new Date().toISOString()
    };
  }
}