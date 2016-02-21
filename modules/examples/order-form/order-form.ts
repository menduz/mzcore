interface IOrderDetail {
    Product: string;
    Qty: number;
    UnitaryPrice: number;
}

interface IOrder {
    Details: mz.Collection<IOrderDetail>;
    Sent: boolean;
    Name: string;
    Total: number;
}


function calculateOrderTotal(details: mz.Collection<IOrderDetail>) {
    return details.reduce<number>((prev: any, curr: IOrderDetail) => {
        return parseFloat(prev || 0) + (curr.Qty || 0) * (curr.UnitaryPrice || 0);
    });
}


class OrderController extends mz.app.Page {
    private orderList = new mz.Collection<IOrder>();

    @OrderController.proxy
    private selectedOrder: IOrder;

    @OrderController.proxy
    private selectedOrderDetail: IOrderDetail;

    constructor(app) {
        super(app);

        this.loadTemplate(module.getPath('./order-form.xml'));

        this.orderList.addRange([
            {
                Details: new mz.Collection<IOrderDetail>([
                    { Product: 'test', Qty: 10, UnitaryPrice: 1 },
                    { Product: 'test 1', Qty: 1, UnitaryPrice: 10 }
                ]),
                Name: 'Test order',
                Sent: false,
                Total: 20
            }
        ])
    }

    selectedOrder_changed(newOrder, prevOrder) {
        if (newOrder == prevOrder) {
            this.orderList.update(this.selectedOrder)
        } else this.selectedOrderDetail = null;
    }

    newOrder() {
        let order: IOrder = {
            Details: new mz.Collection<IOrderDetail>(),
            Sent: false,
            Name: 'New Order',
            Total: 0
        };

        this.orderList.push(order);

        this.selectedOrder = order;
    }

    selectedOrderDetail_changed(selectedOrderDetail) {
        if (this.selectedOrder && this.selectedOrder.Details && this.selectedOrder.Details.contains(selectedOrderDetail)) {
            this.selectedOrder.Details.update(selectedOrderDetail);
            this.selectedOrder.Total = calculateOrderTotal(this.selectedOrder.Details);
            this.touch('selectedOrder');
        }
    }

    newOrderDetail() {
        if (this.selectedOrder) {
            this.selectedOrder.Details.push(this.selectedOrderDetail = {
                Product: '',
                Qty: 1,
                UnitaryPrice: null
            });
        }
    }

    selectOrder(e: mz.IMZComponentEvent) {
        this.selectedOrder = e.data;
    }

    selectOrderDetail(e: mz.IMZComponentEvent) {
        this.selectedOrderDetail = e.data;
    }

    closeOrderDetail() {
        this.selectedOrderDetail = null;
    }
}

export = OrderController;