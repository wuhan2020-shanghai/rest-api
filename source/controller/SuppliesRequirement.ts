import { Object as LCObject, Query, ACL, GeoPoint } from 'leanengine';
import {
    JsonController,
    Post,
    Authorized,
    Ctx,
    Body,
    ForbiddenError,
    Get,
    QueryParam,
    Put,
    Param,
    Delete,
    OnUndefined
} from 'routing-controllers';

import { LCContext, queryPage } from '../utility';
import { RequirementModel } from '../model';
import { RoleController } from './Role';

export class SuppliesRequirement extends LCObject {}

@JsonController('/supplies/requirement')
export class RequirementController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body()
        { hospital, coords, ...rest }: RequirementModel
    ) {
        let requirement = await new Query(SuppliesRequirement)
            .equalTo('hospital', hospital)
            .first();

        if (requirement)
            throw new ForbiddenError(
                '同一医疗机构不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        requirement = await new SuppliesRequirement().setACL(acl).save(
            {
                ...rest,
                hospital,
                coords: new GeoPoint(coords),
                creator: user
            },
            { user }
        );

        return requirement.toJSON();
    }

    @Get()
    getList(
        @QueryParam('province') province: string,
        @QueryParam('city') city: string,
        @QueryParam('district') district: string,
        @QueryParam('hospital') hospital: string,
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(SuppliesRequirement, {
            include: ['creator'],
            equal: { province, city, district },
            contains: { hospital },
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const requirement = await new Query(SuppliesRequirement).get(id);

        return requirement.toJSON();
    }

    @Put('/:id')
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { hospital, coords, ...rest }: RequirementModel
    ) {
        let requirement = LCObject.createWithoutData('SuppliesRequirement', id);

        await requirement.save(
            { ...rest, coords: new GeoPoint(coords) },
            { user }
        );

        requirement = await new Query(SuppliesRequirement)
            .include('creator')
            .get(id);

        return requirement.toJSON();
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('SuppliesRequirement', id).destroy({
            user
        });
    }
}
