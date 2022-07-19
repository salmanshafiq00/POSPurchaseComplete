import { PurchaseStatus } from "../Enums/purchase-status.enum";
import { PurchaseDetails } from "./purchase-details.model";

export class Purchase {
    public id: number;
    public supplierId: number;
    public purchaseDate: Date;
    public status: PurchaseStatus;
    public invoiceNo: string;
    public totalQuantity: number;
    public subTotal: number;
    public otherCharges: number;
    public grandTotal: number;
    public note: string;
    public purchaseDetails: PurchaseDetails[];
}
