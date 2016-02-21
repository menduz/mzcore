declare class OrderController extends mz.app.Page {
    private orderList;
    private selectedOrder;
    private selectedOrderDetail;
    constructor(app: any);
    selectedOrder_changed(newOrder: any, prevOrder: any): void;
    newOrder(): void;
    selectedOrderDetail_changed(selectedOrderDetail: any): void;
    newOrderDetail(): void;
    selectOrder(e: mz.IMZComponentEvent): void;
    selectOrderDetail(e: mz.IMZComponentEvent): void;
    closeOrderDetail(): void;
}
export = OrderController;
