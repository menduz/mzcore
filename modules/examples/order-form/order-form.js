var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports"], function (require, exports) {
    function calculateOrderTotal(details) {
        return details.reduce(function (prev, curr) {
            return parseFloat(prev || 0) + (curr.Qty || 0) * (curr.UnitaryPrice || 0);
        });
    }
    var OrderController = (function (_super) {
        __extends(OrderController, _super);
        function OrderController(app) {
            _super.call(this, app);
            this.orderList = new mz.Collection();
            this.loadTemplate(module.getPath('./order-form.xml'));
            this.orderList.addRange([
                {
                    Details: new mz.Collection([
                        { Product: 'test', Qty: 10, UnitaryPrice: 1 },
                        { Product: 'test 1', Qty: 1, UnitaryPrice: 10 }
                    ]),
                    Name: 'Test order',
                    Sent: false,
                    Total: 20
                }
            ]);
        }
        OrderController.prototype.selectedOrder_changed = function (newOrder, prevOrder) {
            if (newOrder == prevOrder) {
                this.orderList.update(this.selectedOrder);
            }
            else
                this.selectedOrderDetail = null;
        };
        OrderController.prototype.newOrder = function () {
            var order = {
                Details: new mz.Collection(),
                Sent: false,
                Name: 'New Order',
                Total: 0
            };
            this.orderList.push(order);
            this.selectedOrder = order;
        };
        OrderController.prototype.selectedOrderDetail_changed = function (selectedOrderDetail) {
            if (this.selectedOrder && this.selectedOrder.Details && this.selectedOrder.Details.contains(selectedOrderDetail)) {
                this.selectedOrder.Details.update(selectedOrderDetail);
                this.selectedOrder.Total = calculateOrderTotal(this.selectedOrder.Details);
                this.touch('selectedOrder');
            }
        };
        OrderController.prototype.newOrderDetail = function () {
            if (this.selectedOrder) {
                this.selectedOrder.Details.push(this.selectedOrderDetail = {
                    Product: '',
                    Qty: 1,
                    UnitaryPrice: null
                });
            }
        };
        OrderController.prototype.selectOrder = function (e) {
            this.selectedOrder = e.data;
        };
        OrderController.prototype.selectOrderDetail = function (e) {
            this.selectedOrderDetail = e.data;
        };
        OrderController.prototype.closeOrderDetail = function () {
            this.selectedOrderDetail = null;
        };
        __decorate([
            OrderController.proxy, 
            __metadata('design:type', Object)
        ], OrderController.prototype, "selectedOrder", void 0);
        __decorate([
            OrderController.proxy, 
            __metadata('design:type', Object)
        ], OrderController.prototype, "selectedOrderDetail", void 0);
        return OrderController;
    })(mz.app.Page);
    return OrderController;
});
//# sourceMappingURL=order-form.js.map