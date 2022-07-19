import { PurchaseReturnStatus } from "../Enums/purchase-return-status.enum";

export class PurchaseReturnInvoice {
    public id:number;
    public purchaseReturnDate:Date;
    public status: PurchaseReturnStatus;
    public purchaseId :number;
    public invoiceNo: string;
    public totalQuantity: number;
    public subTotal: number;
    public otherCharges: number;
    public grandTotal: number;
    public note: string;
}
