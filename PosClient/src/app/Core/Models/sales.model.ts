import { SalesStatus } from "../Enums/sales-status.enum";
import { SalesDetails } from "./sales-details.model";

export class Sales {
    public id:number;
    public customerId:number;
    public status:SalesStatus;
    public salesDate:Date;
    public invoiceNo: string;
    public totalQuantity: number;
    public subTotal: number;
    public otherCharges: number;
    public grandTotal: number;
    public note: string;
    public salesDetails: SalesDetails[];
}
