"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
const routing_controllers_1 = require("routing-controllers");
const utility_1 = require("../utility");
const model_1 = require("../model");
const Role_1 = require("./Role");
class Hotel extends leanengine_1.Object {
}
exports.Hotel = Hotel;
let HotelController = class HotelController {
    async create({ currentUser: user }, _a) {
        var { name, coords } = _a, rest = __rest(_a, ["name", "coords"]);
        let hotel = await new leanengine_1.Query(Hotel).equalTo('name', name).first();
        if (hotel)
            throw new routing_controllers_1.ForbiddenError('同一宾馆不能重复发布，请联系原发布者修改');
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await Role_1.RoleController.getAdmin(), true);
        hotel = await new Hotel()
            .setACL(acl)
            .save(Object.assign(Object.assign({}, rest), { name, coords: new leanengine_1.GeoPoint(coords), creator: user }), { user });
        return hotel.toJSON();
    }
    getList(size, index) {
        return utility_1.queryPage(Hotel, {
            include: ['creator'],
            size,
            index
        });
    }
    async getOne(id) {
        const hotel = await new leanengine_1.Query(Hotel).get(id);
        return hotel.toJSON();
    }
    async edit({ currentUser: user }, id, _a) {
        var { name, coords } = _a, rest = __rest(_a, ["name", "coords"]);
        let hotel = leanengine_1.Object.createWithoutData('Hotel', id);
        await hotel.save(Object.assign(Object.assign({}, rest), { coords: new leanengine_1.GeoPoint(coords) }), { user });
        hotel = await new leanengine_1.Query(Hotel).include('creator').get(id);
        return hotel.toJSON();
    }
    async delete({ currentUser: user }, id) {
        await leanengine_1.Object.createWithoutData('Hotel', id).destroy({ user });
    }
};
__decorate([
    routing_controllers_1.Post(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, model_1.HotelModel]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get(),
    __param(0, routing_controllers_1.QueryParam('pageSize')),
    __param(1, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], HotelController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Put('/:id'),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, model_1.HotelModel]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Delete('/:id'),
    routing_controllers_1.Authorized(),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "delete", null);
HotelController = __decorate([
    routing_controllers_1.JsonController('/hotel')
], HotelController);
exports.HotelController = HotelController;
//# sourceMappingURL=Hotel.js.map