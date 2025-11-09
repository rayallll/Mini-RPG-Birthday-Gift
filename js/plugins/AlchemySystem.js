"use strict";
/*:
@target MV MZ
@plugindesc UO物品合成·优 v2.1.2
@author うなぎおおとろ/unagiootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/AlchemySystem.js

@param RecipeInfos
@text 配方信息
@type struct<RecipeInfo>[]
@desc 指定配方的详细信息。

@param EnabledMenuAlchemy
@text 启用合成菜单
@type boolean
@default true
@desc 设为true时，会在菜单中添加合成命令。

@param EnabledAlchemySwitchId
@text 合成菜单启用开关ID
@type switch
@default 0
@desc 指定用于启用/禁用菜单合成功能的开关ID。设为0则始终启用合成命令。

@param EnabledCategoryWindow
@text 启用分类窗口显示
@type boolean
@default true
@desc 设为true时，会显示分类选择窗口。

@param EnabledGoldWindow
@text 启用金钱窗口显示
@type boolean
@default true
@desc 设为true时，合成界面会显示当前持有金钱及合成所需金钱。

@param DisplayItemCategory
@text 启用物品分类显示
@type boolean
@default false
@desc 设为true时，合成的分类选择界面会显示物品分类。

@param DisplayWeaponCategory
@text 启用武器分类显示
@type boolean
@default false
@desc 设为true时，合成的分类选择界面会显示武器分类。

@param DisplayArmorCategory
@text 启用防具分类显示
@type boolean
@default false
@desc 设为true时，合成的分类选择界面会显示防具分类。

@param DisplayKeyItemCategory
@text 启用关键物品分类显示
@type boolean
@default false
@desc 设为true时，合成的分类选择界面会显示关键物品分类。

@param EnableIncludeEquipItem
@text 允许装备作为合成素材
@type boolean
@default false
@desc 设为true时，已装备的物品可作为合成素材使用。

@param MaxNumMakeItem
@text 最大合成数量
@type number
@default 999
@desc 指定一次可合成的最大物品数量。

@param MaxMaterials
@text 最大素材种类数
@type number
@default 3
@desc 指定合成时可使用的最大素材种类数量。

@param MakeItemSeFileName
@text 合成音效文件名
@type file
@dir audio/se
@default Heal5
@desc 指定合成物品时播放的音效文件名。

@param MakeItemSeVolume
@text 合成音效音量
@type number
@default 90
@desc 指定合成物品时播放的音效音量。

@param MakeItemSePitch
@text 合成音效音调
@type number
@default 100
@desc 指定合成物品时播放的音效音调。

@param MakeItemSePan
@text 合成音效声道
@type number
@default 0
@desc 指定合成物品时播放的音效声道平衡。

@param MenuAlchemyText
@text 菜单中合成文本
@type string
@default 合成
@desc 指定在菜单中显示的合成命令文本。

@param NeedMaterialText
@text 所需素材文本
@type string
@default 所需素材：
@desc 指定显示所需素材时的提示文本。

@param NeedPriceText
@text 所需费用文本
@type string
@default 所需费用：
@desc 指定显示所需费用时的提示文本。

@param TargetItemText
@text 生成物品文本
@type string
@default 生成物品：
@desc 指定显示生成物品时的提示文本。

@param NoteParseErrorMessage
@text 备注解析错误信息
@type string
@default 备注栏解析失败。相关内容：(%1)
@desc 备注栏解析失败时的错误提示信息。无需修改此参数。


@command StartAlchemyScene
@text 打开合成界面
@desc 打开物品合成的场景界面。

@help
本插件用于实现简单的物品合成功能。

【使用方法】
通过获取配方可以进行物品合成。
当玩家持有作为配方的普通物品时，即可合成该配方中注册的物品。

■ 配方的创建
在插件参数“配方信息”中指定配方物品与配方内容的对应关系。
需指定作为配方的物品ID，并在配方列表中注册对应的合成规则。
一个配方物品可注册多个合成规则，即持有一个配方物品可解锁多个合成配方。

■ 物品信息说明
配方中的“物品信息”需指定物品类型、物品ID、武器ID、防具ID。
只需填写与物品类型对应的ID即可，其他类型的ID可保持0不变。

■ 打开合成界面
通过插件命令“打开合成界面”可打开合成场景。
在RPG Maker MV中，需输入以下命令：
AlchemySystem StartAlchemyScene

■ 与旧版本的兼容性
旧版本通过物品备注栏设置配方，此方式可与本版本的插件参数设置方式兼容使用。

===================== 以下是旧版本的配方设置方式 =====================
■ 配方的创建
在配方物品的备注栏中按以下格式填写合成规则：
<recipe>
"material": [素材物品信息1, 素材物品信息2, ...]
"price": 合成所需费用
"target": 合成结果物品信息
</recipe>

素材物品信息...素材物品的详细信息。
                  格式为：["类型标识", ID, 数量]
                  类型标识...表示物品类型的标识，可选"item"（物品）、"weapon"（武器）、"armor"（防具）。
                  ID...对应类型的物品ID。
                  数量...合成所需的该素材数量。

合成所需费用...合成时消耗的金钱。
                可选参数，不填写则默认为0。

合成结果物品信息...合成后生成的物品信息。
                     格式为：["类型标识", ID]
                     类型标识...同素材物品的类型标识。
                     ID...对应类型的物品ID。

例如，用1个高级药水（ID:8）和2个魔法水（ID:10）合成1个全恢复药水（ID:9），格式如下（注意末尾逗号）：
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"target": ["item", 9]
</recipe>

若需额外消耗100G，格式如下：
<recipe>
"material": [["item", 8, 1], ["item", 10, 2]],
"price": 100,
"target": ["item", 9]
</recipe>

一个配方物品可对应多个合成规则，在备注栏中按以下格式填写多个配方即可：
<recipe>
"material": [素材物品信息1, 素材物品信息2, ...]
"price": 合成所需费用
"target": 合成结果物品信息
</recipe>
<recipe>
"material": [素材物品信息1, 素材物品信息2, ...]
"price": 合成所需费用
"target": 合成结果物品信息
</recipe>


【许可证】
本插件基于MIT许可证发布，可自由使用。
*/
/*~struct~RecipeInfo:
@param RecipeItem
@text 配方物品
@type item
@desc 指定作为配方的物品ID。

@param Recipe
@text 配方列表
@type struct<Recipe>[]
@desc 指定该配方物品中包含的合成规则。

@param Memo
@text 备注
@type multiline_string
@desc 通用备注栏，插件内部不使用此信息。
*/
/*~struct~Recipe:
@param Materials
@text 素材列表
@type struct<Material>[]
@desc 指定合成所需的素材。

@param Price
@text 所需费用
@type number
@default 0
@desc 指定合成所需的金钱数量。

@param TargetItemInfo
@text 生成物品信息
@type struct<ItemInfo>
@desc 指定合成后生成的物品信息。
*/
/*~struct~Material:
@param ItemInfo
@text 物品信息
@type struct<ItemInfo>
@desc 指定素材的物品信息。

@param NeedItems
@text 所需数量
@type number
@default 1
@desc 指定合成所需的该素材数量。
*/
/*~struct~ItemInfo:
@param Type
@text 物品类型
@type select
@option 物品
@value Item
@option 武器
@value Weapon
@option 防具
@value Armor
@default Item
@desc 指定物品类型（物品/武器/防具）。

@param ItemId
@text 物品ID
@type item
@default 0
@desc 指定物品的ID，类型为“物品”时有效，其他类型设为0。

@param WeaponId
@text 武器ID
@type weapon
@default 0
@desc 指定武器的ID，类型为“武器”时有效，其他类型设为0。

@param ArmorId
@text 防具ID
@type armor
@default 0
@desc 指定防具的ID，类型为“防具”时有效，其他类型设为0。
*/
const AlchemySystemPluginName = document.currentScript ? decodeURIComponent(document.currentScript.src.match(/^.*\/(.+)\.js$/)[1]) : "AlchemySystem";
var AlchemySystem;
(function (AlchemySystem) {
    class PluginParamsParser {
        constructor(predictEnable = true) {
            this._predictEnable = predictEnable;
        }
        static parse(params, typeData, predictEnable = true) {
            return new PluginParamsParser(predictEnable).parse(params, typeData);
        }
        parse(params, typeData, loopCount = 0) {
            if (++loopCount > 255)
                throw new Error("循环解析错误");
            const result = {};
            for (const name in typeData) {
                if (params[name] === "" || params[name] === undefined) {
                    result[name] = null;
                }
                else {
                    result[name] = this.convertParam(params[name], typeData[name], loopCount);
                }
            }
            if (!this._predictEnable)
                return result;
            if (typeof params === "object" && !(params instanceof Array)) {
                for (const name in params) {
                    if (result[name])
                        continue;
                    const param = params[name];
                    const type = this.predict(param);
                    result[name] = this.convertParam(param, type, loopCount);
                }
            }
            return result;
        }
        convertParam(param, type, loopCount) {
            if (typeof type === "string") {
                return this.cast(param, type);
            }
            else if (typeof type === "object" && type instanceof Array) {
                const aryParam = JSON.parse(param);
                if (type[0] === "string") {
                    return aryParam.map((strParam) => this.cast(strParam, type[0]));
                }
                else {
                    return aryParam.map((strParam) => this.parse(JSON.parse(strParam), type[0]), loopCount);
                }
            }
            else if (typeof type === "object") {
                return this.parse(JSON.parse(param), type, loopCount);
            }
            else {
                throw new Error(`${type} 不是字符串或对象类型`);
            }
        }
        cast(param, type) {
            switch (type) {
                case "any":
                    if (!this._predictEnable)
                        throw new Error("预测模式已关闭");
                    return this.cast(param, this.predict(param));
                case "string":
                    return param;
                case "number":
                    if (param.match(/^\-?\d+\.\d+$/))
                        return parseFloat(param);
                    return parseInt(param);
                case "boolean":
                    return param === "true";
                default:
                    throw new Error(`未知类型: ${type}`);
            }
        }
        predict(param) {
            if (param.match(/^\-?\d+$/) || param.match(/^\-?\d+\.\d+$/)) {
                return "number";
            }
            else if (param === "true" || param === "false") {
                return "boolean";
            }
            else {
                return "string";
            }
        }
    }
    const typeDefine = {
        RecipeInfos: [{
                Recipe: [{
                        Materials: [{
                                ItemInfo: {}
                            }],
                        TargetItemInfo: {}
                    }]
            }]
    };
    const PP = PluginParamsParser.parse(PluginManager.parameters(AlchemySystemPluginName), typeDefine);
    const EnabledMenuAlchemy = PP.EnabledMenuAlchemy;
    const EnabledAlchemySwitchId = PP.EnabledAlchemySwitchId;
    const EnabledCategoryWindow = PP.EnabledCategoryWindow;
    const EnabledGoldWindow = PP.EnabledGoldWindow;
    const DisplayItemCategory = PP.DisplayItemCategory == null ? true : PP.DisplayItemCategory;
    const DisplayWeaponCategory = PP.DisplayWeaponCategory == null ? true : PP.DisplayWeaponCategory;
    const DisplayArmorCategory = PP.DisplayArmorCategory == null ? true : PP.DisplayArmorCategory;
    const DisplayKeyItemCategory = PP.DisplayKeyItemCategory;
    const EnableIncludeEquipItem = PP.EnableIncludeEquipItem;
    const MaxNumMakeItem = PP.MaxNumMakeItem;
    const MaxMaterials = PP.MaxMaterials;
    const MakeItemSeFileName = PP.MakeItemSeFileName;
    const MakeItemSeVolume = PP.MakeItemSeVolume;
    const MakeItemSePitch = PP.MakeItemSePitch;
    const MakeItemSePan = PP.MakeItemSePan;
    const MenuAlchemyText = PP.MenuAlchemyText;
    const NeedMaterialText = PP.NeedMaterialText;
    const NeedPriceText = PP.NeedPriceText;
    const TargetItemText = PP.TargetItemText;
    const NoteParseErrorMessage = PP.NoteParseErrorMessage;
    // 兼容MV版本
    if (Utils.RPGMAKER_NAME === "MV") {
        Window_Base.prototype.drawRect = function (x, y, width, height) {
            const outlineColor = this.contents.outlineColor;
            const mainColor = this.contents.textColor;
            this.contents.fillRect(x, y, width, height, outlineColor);
            this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
        };
        Window_Base.prototype.itemPadding = function () {
            return 8;
        };
        Window_Selectable.prototype.itemRectWithPadding = function (index) {
            const rect = this.itemRect(index);
            const padding = this.itemPadding();
            rect.x += padding;
            rect.width -= padding * 2;
            return rect;
        };
        Window_Selectable.prototype.itemLineRect = function (index) {
            const rect = this.itemRectWithPadding(index);
            const padding = (rect.height - this.lineHeight()) / 2;
            rect.y += padding;
            rect.height -= padding * 2;
            return rect;
        };
        Object.defineProperty(Window.prototype, "innerWidth", {
            get: function () {
                return Math.max(0, this._width - this._padding * 2);
            },
            configurable: true
        });
        Object.defineProperty(Window.prototype, "innerHeight", {
            get: function () {
                return Math.max(0, this._height - this._padding * 2);
            },
            configurable: true
        });
        Scene_Base.prototype.calcWindowHeight = function (numLines, selectable) {
            if (selectable) {
                return Window_Selectable.prototype.fittingHeight(numLines);
            }
            else {
                return Window_Base.prototype.fittingHeight(numLines);
            }
        };
        Scene_Base.prototype.mainCommandWidth = function () {
            return 240;
        };
        Scene_MenuBase.prototype.mainAreaTop = function () {
            return this.helpAreaHeight();
            ;
        };
        Scene_MenuBase.prototype.mainAreaBottom = function () {
            return this.mainAreaTop() + this.mainAreaHeight();
        };
        Scene_MenuBase.prototype.mainAreaHeight = function () {
            return Graphics.boxHeight - this.helpAreaHeight();
        };
        Scene_MenuBase.prototype.helpAreaHeight = function () {
            return this.calcWindowHeight(2, false);
        };
    }
    let $recipes = null;
    class PartyItemUtils {
        static partyItemCount(itemInfo) {
            let count = this._partyItemCountWithoutEquips(itemInfo);
            if (EnableIncludeEquipItem) {
                if (itemInfo.type === "weapon") {
                    count += this._allPartyEquipWeapons().filter((item) => item && item.id === itemInfo.id).length;
                }
                else if (itemInfo.type === "armor") {
                    count += this._allPartyEquipArmors().filter((item) => item && item.id === itemInfo.id).length;
                }
            }
            return count;
        }
        static _partyItemCountWithoutEquips(itemInfo) {
            return $gameParty.numItems(itemInfo.itemData());
        }
        static _allPartyEquipWeapons() {
            const equipSlotItems = $gameParty.members().flatMap((actor) => actor._equips);
            const weaponItems = equipSlotItems.filter((item) => item.isWeapon() && item.itemId() > 0);
            return weaponItems.map((item) => item.object());
        }
        static _allPartyEquipArmors() {
            const equipSlotItems = $gameParty.members().flatMap((actor) => actor._equips);
            const armorItems = equipSlotItems.filter((item) => item.isArmor() && item.itemId() > 0);
            return armorItems.map((item) => item.object());
        }
        static gainPartyItem(itemInfo, gainCount) {
            const itemData = itemInfo.itemData();
            if (gainCount > 0) {
                $gameParty.gainItem(itemData, gainCount);
            }
            else if (gainCount < 0) {
                if (EnableIncludeEquipItem && itemInfo.type !== "item") {
                    const purgeCount = -gainCount;
                    const partyItemCount = this.partyItemCount(itemInfo);
                    if (purgeCount > partyItemCount) {
                        throw new Error(`需移除数量(${purgeCount})超过持有总量(${partyItemCount})`);
                    }
                    const partyItemCountWithoutEquips = this._partyItemCountWithoutEquips(itemInfo);
                    if (partyItemCountWithoutEquips >= purgeCount) {
                        $gameParty.gainItem(itemData, gainCount);
                    }
                    else {
                        if (partyItemCountWithoutEquips > 0)
                            $gameParty.gainItem(itemData, -partyItemCountWithoutEquips);
                        this._purgePartyEquipItem(itemInfo, purgeCount - partyItemCountWithoutEquips);
                    }
                }
                else {
                    $gameParty.gainItem(itemData, gainCount);
                }
            }
        }
        static _purgePartyEquipItem(itemInfo, purgeCount) {
            if (purgeCount <= 0)
                return;
            for (const actor of $gameParty.members()) {
                for (let i = 0; i < actor._equips.length; i++) {
                    let purgeFlag = false;
                    if (itemInfo.type === "weapon") {
                        if (actor._equips[i].isWeapon() && itemInfo.id === actor._equips[i].itemId())
                            purgeFlag = true;
                    }
                    else if (itemInfo.type === "armor") {
                        if (actor._equips[i].isArmor() && itemInfo.id === actor._equips[i].itemId())
                            purgeFlag = true;
                    }
                    if (purgeFlag) {
                        actor._equips[i].setEquip("", 0);
                        purgeCount--;
                        if (purgeCount <= 0)
                            return;
                    }
                }
            }
        }
    }
    AlchemySystem.PartyItemUtils = PartyItemUtils;
    class ItemInfo {
        constructor(type, id) {
            this._type = type;
            this._id = id;
        }
        get type() { return this._type; }
        set type(_type) { this._type = _type; }
        get id() { return this._id; }
        set id(_id) { this._id = _id; }
        static fromParams(params) {
            let itemInfo;
            if (params.Type === "Item") {
                itemInfo = new ItemInfo("item", params.ItemId);
            }
            else if (params.Type === "Weapon") {
                itemInfo = new ItemInfo("weapon", params.WeaponId);
            }
            else if (params.Type === "Armor") {
                itemInfo = new ItemInfo("armor", params.ArmorId);
            }
            else {
                throw new Error(`类型 ${params.Type} 未知`);
            }
            return itemInfo;
        }
        // 生成唯一标识物品的标签
        tag() {
            return `${this._type}_${this._id}`;
        }
        itemData() {
            switch (this._type) {
                case "item":
                    return $dataItems[this._id];
                case "weapon":
                    return $dataWeapons[this._id];
                case "armor":
                    return $dataArmors[this._id];
            }
            throw new Error(`${this._type} 类型不存在`);
        }
        partyItemCount() {
            switch (this._type) {
                case "item":
                    return $gameParty.itemCount(this._id);
                case "weapon":
                    return $gameParty.weaponCount(this._id);
                case "armor":
                    return $gameParty.armorCount(this._id);
                default:
                    throw new Error(`${this._type} 类型不存在`);
            }
        }
    }
    class Material {
        constructor(itemInfo, count) {
            this._itemInfo = itemInfo;
            this._count = count;
        }
        get itemInfo() { return this._itemInfo; }
        set itemInfo(_itemInfo) { this._itemInfo = _itemInfo; }
        get count() { return this._count; }
        set count(_count) { this._count = _count; }
    }
    class AlchemyRecipe {
        constructor(materials, price, targetItemInfo) {
            this._materials = materials;
            this._price = price;
            this._targetItemInfo = targetItemInfo;
        }
        static fromRecipeData(recipeData) {
            const materials = {};
            for (const materialData of recipeData.material) {
                const itemInfo = new ItemInfo(materialData[0], materialData[1]);
                const material = new Material(itemInfo, materialData[2]);
                materials[itemInfo.tag()] = material;
            }
            const targetItemInfo = new ItemInfo(recipeData.target[0], recipeData.target[1]);
            const price = recipeData.price ? recipeData.price : 0;
            return new AlchemyRecipe(materials, price, targetItemInfo);
        }
        static fromRecipeDataV2(recipeDataV2) {
            const materials = {};
            for (const materialData of recipeDataV2.Materials) {
                const itemInfo = ItemInfo.fromParams(materialData.ItemInfo);
                const material = new Material(itemInfo, materialData.NeedItems);
                materials[itemInfo.tag()] = material;
            }
            const targetItemInfo = ItemInfo.fromParams(recipeDataV2.TargetItemInfo);
            const price = recipeDataV2.Price;
            return new AlchemyRecipe(materials, price, targetItemInfo);
        }
        materials() {
            return this._materials;
        }
        price() {
            return this._price;
        }
        targetItemInfo() {
            return this._targetItemInfo;
        }
        targetItemData() {
            return this._targetItemInfo.itemData();
        }
        needItemCount(itemInfo) {
            return this._materials[itemInfo.tag()].count;
        }
        hasItemCount(itemInfo) {
            return PartyItemUtils.partyItemCount(itemInfo);
        }
        maxMakeItemCount() {
            const targetItem = this.targetItemData();
            const maxRemainingCount = $gameParty.maxItems(targetItem) - PartyItemUtils.partyItemCount(this._targetItemInfo);
            if (maxRemainingCount <= 0)
                return 0;
            let makeItemCount = this.maxMakeItemCountNoLimit();
            if (makeItemCount > MaxNumMakeItem)
                makeItemCount = MaxNumMakeItem;
            return makeItemCount > maxRemainingCount ? maxRemainingCount : makeItemCount;
        }
        maxMakeItemCountNoLimit() {
            let minCount;
            minCount = (this._price > 0 ? Math.floor($gameParty.gold() / this._price) : MaxNumMakeItem);
            if (minCount === 0)
                return 0;
            for (const tag in this._materials) {
                const itemInfo = this._materials[tag].itemInfo;
                const count = Math.floor(this.hasItemCount(itemInfo) / this.needItemCount(itemInfo));
                if (count === 0)
                    return 0;
                if (count < minCount)
                    minCount = count;
            }
            return minCount;
        }
        canMakeItem() {
            return this.maxMakeItemCount() > 0;
        }
        makeItem(targetItemCount) {
            for (const tag in this._materials) {
                const material = this._materials[tag];
                PartyItemUtils.gainPartyItem(material.itemInfo, -material.count * targetItemCount);
            }
            $gameParty.gainGold(-this._price * targetItemCount);
            PartyItemUtils.gainPartyItem(this._targetItemInfo, targetItemCount);
        }
    }
    class Scene_Alchemy extends Scene_MenuBase {
        create() {
            super.create();
            this.createRecipes();
            this.createHelpWindow();
            this.createSelectRecipesWindow();
            this.createNumberWindow();
            if (EnabledCategoryWindow)
                this.createCategoryWindow();
            if (EnabledGoldWindow)
                this.createGoldWindow();
            this.createRecipeDetailWindow();
        }
        start() {
            super.start();
            this._windowSelectRecipes.open();
            this._windowRecipeDetail.open();
            this._helpWindow.show();
            if (EnabledCategoryWindow) {
                this._categoryWindow.open();
                this._categoryWindow.activate();
            }
            else {
                this._windowSelectRecipes.refresh();
                this._windowSelectRecipes.activate();
                this._windowSelectRecipes.select(0);
            }
        }
        createRecipes() {
            $recipes = [];
            // 解析物品备注栏中的配方（旧版本方式）
            for (const item of $gameParty.items()) {
                const recipeDatas = this.parseRecipeData(item);
                for (const recipeData of recipeDatas) {
                    $recipes.push(AlchemyRecipe.fromRecipeData(recipeData));
                }
            }
            // 解析插件参数中的配方（新版本方式）
            for (const item of $gameParty.items()) {
                for (const recipeInfo of PP.RecipeInfos) {
                    if (item.id === recipeInfo.RecipeItem) {
                        for (const recipe of recipeInfo.Recipe) {
                            $recipes.push(AlchemyRecipe.fromRecipeDataV2(recipe));
                        }
                        break;
                    }
                }
            }
        }
        parseRecipeData(item) {
            const recipeDatas = [];
            const reg = /<recipe>(.+?)<\/recipe>/sg;
            while (true) {
                const matchData = reg.exec(item.note);
                if (!matchData)
                    break;
                const strNote = matchData[1];
                try {
                    const recipeData = JSON.parse("{" + strNote + "}");
                    recipeDatas.push(recipeData);
                }
                catch (e) {
                    console.error(e);
                    throw NoteParseErrorMessage.format(strNote);
                }
            }
            return recipeDatas;
        }
        createCategoryWindow() {
            this._categoryWindow = new Window_AlchemyCategory(this.categoryWindowRect());
            this._categoryWindow.setHelpWindow(this._helpWindow);
            this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
            this._categoryWindow.setItemWindow(this._windowSelectRecipes);
            this._categoryWindow.deactivate();
            this.addWindow(this._categoryWindow);
        }
        createGoldWindow() {
            const rect = this.goldWindowRect();
            this._goldWindow = new Window_Gold_MZMV(rect);
            this.addWindow(this._goldWindow);
        }
        createSelectRecipesWindow() {
            this._windowSelectRecipes = new Window_SelectRecipes(this.selectRecipesWindowRect());
            this._windowSelectRecipes.setHandler("ok", this.selectRecipesOk.bind(this));
            this._windowSelectRecipes.setHandler("select", this.selectRecipesSelect.bind(this));
            this._windowSelectRecipes.setHandler("cancel", this.selectRecipesCancel.bind(this));
            this._windowSelectRecipes.setHelpWindow(this._helpWindow);
            this._windowSelectRecipes.refresh();
            this._windowSelectRecipes.close();
            this._windowSelectRecipes.deactivate();
            this._windowSelectRecipes.hideHelpWindow();
            this._windowSelectRecipes.show();
            this._helpWindow.hide();
            if (this._windowSelectRecipes.maxItems() > 0)
                this._windowSelectRecipes.select(0);
            this.addWindow(this._windowSelectRecipes);
        }
        createNumberWindow() {
            const rect = this.numberWindowRect();
            this._numberWindow = new Window_AlchemyNumber(rect);
            this._numberWindow.hide();
            this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
            this._numberWindow.setHandler("changeNumber", this.onNumberChange.bind(this));
            this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
            this.addWindow(this._numberWindow);
        }
        createRecipeDetailWindow() {
            this._windowRecipeDetail = new Window_RecipeDetail(this.recipeDetailWindowRect());
            this._windowRecipeDetail.setNumberWindow(this._numberWindow);
            this._windowRecipeDetail.refresh();
            this._windowRecipeDetail.close();
            this._windowRecipeDetail.deactivate();
            this._windowRecipeDetail.show();
            this.addWindow(this._windowRecipeDetail);
        }
        categoryWindowRect() {
            const goldWindowRect = this.goldWindowRect();
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = (EnabledGoldWindow ? Graphics.boxWidth - goldWindowRect.width : Graphics.boxWidth);
            const wh = (EnabledCategoryWindow || EnabledGoldWindow ? this.calcWindowHeight(1, true) : 0);
            return new Rectangle(wx, wy, ww, wh);
        }
        goldWindowRect() {
            const ww = this.mainCommandWidth();
            const wh = this.calcWindowHeight(1, true);
            const wx = Graphics.boxWidth - ww;
            const wy = this.mainAreaTop();
            return new Rectangle(wx, wy, ww, wh);
        }
        numberWindowRect() {
            return this.selectRecipesWindowRect();
        }
        selectRecipesWindowRect() {
            const categoryWindowRect = this.categoryWindowRect();
            const wx = 0;
            const wy = categoryWindowRect.y + categoryWindowRect.height;
            const ww = Math.floor(Graphics.boxWidth / 2);
            const wh = this.mainAreaBottom() - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
        recipeDetailWindowRect() {
            const selectRecipesWindowRect = this.selectRecipesWindowRect();
            const wx = selectRecipesWindowRect.x + selectRecipesWindowRect.width;
            const wy = selectRecipesWindowRect.y;
            const ww = Graphics.boxWidth - wx;
            const wh = selectRecipesWindowRect.height;
            return new Rectangle(wx, wy, ww, wh);
        }
        onCategoryOk() {
            this.changeCategoryWindowToSelectRecipesWindow();
        }
        onCategoryCancel() {
            this.popScene();
        }
        selectRecipesOk() {
            if (this._windowSelectRecipes.maxItems() === 0)
                return;
            const recipe = this._windowSelectRecipes.recipe();
            this._numberWindow.setup(recipe.targetItemData(), recipe.maxMakeItemCount(), 2);
            this.changeSelectRecipesWindowToNumberWindow();
        }
        selectRecipesCancel() {
            if (EnabledCategoryWindow) {
                this.changeSelectRecipesWindowToCategoryWindow();
            }
            else {
                this.popScene();
            }
        }
        selectRecipesSelect() {
            if (!this._windowRecipeDetail)
                return;
            const recipe = this._windowSelectRecipes.recipe();
            this._windowRecipeDetail.setRecipe(recipe);
            this._windowRecipeDetail.refresh();
        }
        onNumberOk() {
            const recipe = this._windowSelectRecipes.recipe();
            recipe.makeItem(this._numberWindow.number());
            if (EnabledGoldWindow)
                this._goldWindow.refresh();
            this.playMakeItemSe();
            this.changeNumberWindowToSelectRecipesWindow();
        }
        onNumberChange() {
            this._windowRecipeDetail.refresh();
        }
        onNumberCancel() {
            this.changeNumberWindowToSelectRecipesWindow();
        }
        playMakeItemSe() {
            if (MakeItemSeFileName === "")
                return;
            const se = {
                name: MakeItemSeFileName,
                pan: MakeItemSePan,
                pitch: MakeItemSePitch,
                volume: MakeItemSeVolume,
            };
            AudioManager.playSe(se);
        }
        changeCategoryWindowToSelectRecipesWindow() {
            this._categoryWindow.deactivate();
            this._windowSelectRecipes.refresh();
            this._windowSelectRecipes.activate();
            this._windowSelectRecipes.select(0);
        }
        changeSelectRecipesWindowToMakeItemYesOrNoWindow() {
            this._windowSelectRecipes.deactivate();
            this._windowSelectRecipes.refresh();
            this._windowMakeItemYesOrNo.open();
            this._windowMakeItemYesOrNo.activate();
        }
        changeSelectRecipesWindowToCategoryWindow() {
            this._windowSelectRecipes.deactivate();
            this._windowSelectRecipes.select(-1);
            this._windowSelectRecipes.refresh();
            this._categoryWindow.activate();
        }
        changeSelectRecipesWindowToNumberWindow() {
            this._windowSelectRecipes.deactivate();
            this._windowSelectRecipes.refresh();
            this._numberWindow.show();
            this._numberWindow.activate();
        }
        changeNumberWindowToSelectRecipesWindow() {
            this._numberWindow.hide();
            this._numberWindow.deactivate();
            this._numberWindow.setNumber(1);
            this._windowRecipeDetail.refresh();
            this._windowSelectRecipes.refresh();
            this._windowSelectRecipes.activate();
        }
    }
    class Window_SelectRecipes extends Window_Selectable {
        initialize(rect) {
            this._recipes = [];
            if (EnabledCategoryWindow) {
                this._category = "none";
            }
            else {
                this._category = null;
            }
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // MV兼容性处理
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
        }
        updateHelp() {
            if (!this.recipe())
                return;
            this.setHelpWindowItem(this.recipe().targetItemData());
        }
        // 由Window_AlchemyCategory调用的方法
        setCategory(category) {
            if (category !== this._category) {
                this._category = category;
                this.refresh();
            }
        }
        maxCols() {
            return 1;
        }
        maxItems() {
            return this._recipes.length;
        }
        isCurrentItemEnabled() {
            const recipe = this.recipe();
            if (!recipe)
                return false;
            return recipe.canMakeItem();
        }
        drawItem(index) {
            const recipe = this._recipes[index];
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(recipe.canMakeItem());
            this.drawItemName(recipe.targetItemData(), rect.x, rect.y, rect.width);
            this.changePaintOpacity(true);
        }
        numberWidth() {
            return this.textWidth('000');
        }
        ;
        makeItemList() {
            if (EnabledCategoryWindow) {
                this._recipes = this.recipesByCategory();
            }
            else {
                this._recipes = $recipes;
            }
        }
        recipesByCategory() {
            return $recipes.filter((recipe) => {
                if (recipe.targetItemInfo().type === "item") {
                    const itemData = recipe.targetItemInfo().itemData();
                    if (this._category === "item") {
                        return itemData.itypeId === 1;
                    }
                    else if (this._category === "keyItem") {
                        return itemData.itypeId === 2;
                    }
                }
                else {
                    return recipe.targetItemInfo().type === this._category;
                }
            });
        }
        select(index) {
            super.select(index);
            this.callHandler("select");
        }
        selectLast() {
            this.select(this.maxItems() - 1);
        }
        refresh() {
            this.makeItemList();
            this.createContents();
            this.drawAllItems();
        }
        recipe() {
            if (this._recipes.length === 0)
                return null;
            return this._recipes[this.index()];
        }
    }
    class Window_AlchemyCategory extends Window_ItemCategory {
        initialize(rect) {
            this._windowRect = rect;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // MV兼容性处理
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
            this.x = rect.x;
            this.y = rect.y;
        }
        windowWidth() {
            return this._windowRect.width;
        }
        windowHeight() {
            return this._windowRect.height;
        }
        makeCommandList() {
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.makeCommandList();
            }
            else {
                if (DisplayItemCategory)
                    this.addCommand(TextManager.item, "item");
                if (DisplayWeaponCategory)
                    this.addCommand(TextManager.weapon, "weapon");
                if (DisplayArmorCategory)
                    this.addCommand(TextManager.armor, "armor");
                if (DisplayKeyItemCategory)
                    this.addCommand(TextManager.keyItem, "keyItem");
            }
        }
        ;
        needsCommand(name) {
            if (!DisplayItemCategory && name === "item")
                return false;
            if (!DisplayWeaponCategory && name === "weapon")
                return false;
            if (!DisplayArmorCategory && name === "armor")
                return false;
            if (!DisplayKeyItemCategory && name === "keyItem")
                return false;
            return super.needsCommand(name);
        }
        maxCols() {
            let cols = 4;
            if (!DisplayItemCategory)
                cols--;
            if (!DisplayWeaponCategory)
                cols--;
            if (!DisplayArmorCategory)
                cols--;
            if (!DisplayKeyItemCategory)
                cols--;
            return cols;
        }
    }
    class Window_Gold_MZMV extends Window_Gold {
        initialize(rect) {
            this._windowRect = rect;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // MV兼容性处理
                super.initialize(rect.x, rect.y);
            }
        }
        windowWidth() {
            return this._windowRect.width;
        }
        windowHeight() {
            return this._windowRect.height;
        }
    }
    class Window_AlchemyNumber extends Window_ShopNumber {
        initialize(rect) {
            this._windowRect = rect;
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // MV兼容性处理
                super.initialize(rect.x, rect.y, rect.height);
            }
        }
        setNumber(number) {
            this._number = number;
        }
        windowWidth() {
            return this._windowRect.width;
        }
        windowHeight() {
            return this._windowRect.height;
        }
        refresh() {
            Window_Selectable.prototype.refresh.call(this);
            if (Utils.RPGMAKER_NAME === "MZ") {
                this.drawItemBackground(0);
                this.drawCurrentItemName();
            }
            else {
                let width = this.innerWidth;
                const sign = "\u00d7";
                width = width - this.textWidth(sign) - this.itemPadding() * 2;
                width = width - this.cursorWidth() - this.itemPadding() * 2;
                // MV兼容性处理
                this.drawItemName(this._item, 0, this.itemY(), width);
            }
            this.drawMultiplicationSign();
            this.drawNumber();
        }
        changeNumber(amount) {
            super.changeNumber(amount);
            this.callHandler("changeNumber");
        }
    }
    class Window_RecipeDetail extends Window_Base {
        initialize(rect) {
            if (Utils.RPGMAKER_NAME === "MZ") {
                super.initialize(rect);
            }
            else {
                // MV兼容性处理
                super.initialize(rect.x, rect.y, rect.width, rect.height);
            }
            this._numberWindow = null;
        }
        setNumberWindow(numberWindow) {
            this._numberWindow = numberWindow;
        }
        setRecipe(recipe) {
            this._recipe = recipe;
        }
        refresh() {
            if (this.contents) {
                this.contents.clear();
                this.draw();
            }
        }
        draw() {
            if (!this._recipe)
                return;
            this.drawPossession();
            this.drawMaterials();
            if (EnabledGoldWindow)
                this.drawTotalPrice();
            this.drawTargetItem();
        }
        drawPossession() {
            const x = this.itemPadding();
            const y = this.itemPadding();
            const width = this.innerWidth - this.itemPadding() - x;
            const possessionWidth = this.textWidth("0000");
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.possession, x, y, width - possessionWidth);
            this.resetTextColor();
            this.drawText(PartyItemUtils.partyItemCount(this._recipe.targetItemInfo()), x, y, width, "right");
        }
        ;
        drawMaterials() {
            const recipe = this._recipe;
            const width = this.innerWidth - this.itemPadding() * 2;
            const x = this.itemPadding();
            let y = this.itemPadding() + this.lineHeight();
            this.changeTextColor(this.systemColor());
            this.drawText(NeedMaterialText, x, y, width);
            y += this.lineHeight();
            this.drawHorzLine(y - 5);
            this.resetTextColor();
            for (const tag in recipe.materials()) {
                const material = recipe.materials()[tag];
                const needItemCount = recipe.needItemCount(material.itemInfo) * this._numberWindow.number();
                const hasItemCount = recipe.hasItemCount(material.itemInfo);
                const item = material.itemInfo.itemData();
                this.drawItemName(item, x, y, width - this.numberWidth());
                if (needItemCount <= hasItemCount) {
                    this.changeTextColor(this.crisisColor());
                }
                else {
                    this.changePaintOpacity(false);
                }
                this.drawItemNumber(needItemCount, hasItemCount, x, y, width);
                this.resetTextColor();
                this.changePaintOpacity(true);
                y += this.lineHeight();
            }
        }
        drawTotalPrice() {
            const x = this.itemPadding();
            const minY = this.totalPriceYOfs(MaxMaterials);
            let y = this.totalPriceYOfs(Object.keys(this._recipe.materials()).length);
            if (y < minY)
                y = minY;
            const currentUnit = TextManager.currencyUnit;
            const width = this.innerWidth - this.itemPadding() * 2;
            const goldText = `${this._recipe.price() * this._numberWindow.number()}`;
            this.changeTextColor(this.systemColor());
            this.drawText(NeedPriceText, x, y, width, "left");
            this.resetTextColor();
            this.drawText(goldText, x, y, width - this.textWidth(currentUnit), "right");
            this.changeTextColor(this.systemColor());
            this.drawText(currentUnit, x, y, width, "right");
            this.drawHorzLine(y + this.lineHeight() - 5);
            this.resetTextColor();
        }
        totalPriceYOfs(lines) {
            return this.itemPadding() + lines * this.lineHeight() + this.lineHeight() * 2 + 20;
        }
        drawItemNumber(needItemCount, hasItemCount, x, y, width) {
            this.drawText(`${needItemCount}/${hasItemCount}`, x, y, width, "right");
        }
        numberWidth() {
            return this.textWidth("000/000");
        }
        drawTargetItem() {
            const width = this.innerWidth - this.itemPadding() * 2;
            const x = this.itemPadding();
            let y;
            y = this.targetItemYOfs(Object.keys(this._recipe.materials()).length);
            const minY = this.targetItemYOfs(MaxMaterials);
            if (y < minY)
                y = minY;
            const item = this._recipe.targetItemData();
            this.changeTextColor(this.systemColor());
            this.drawText(TargetItemText, x, y, width);
            this.drawHorzLine(y + this.lineHeight() - 5);
            this.resetTextColor();
            this.drawItemName(item, x, y + this.lineHeight(), width);
        }
        targetItemYOfs(lines) {
            if (EnabledGoldWindow) {
                return this.totalPriceYOfs(lines) + this.lineHeight() + 20;
            }
            else {
                return this.totalPriceYOfs(lines);
            }
        }
        drawHorzLine(y) {
            const padding = this.itemPadding();
            const x = padding;
            const width = this.innerWidth - padding * 2;
            this.drawRect(x, y, width, 5);
        }
        crisisColor() {
            if (Utils.RPGMAKER_NAME === "MZ") {
                return ColorManager.crisisColor();
            }
            else {
                // MV兼容性处理
                return super.crisisColor();
            }
        }
    }
    Game_Party.prototype.itemCount = function (itemId) {
        return this._items[itemId] ? this._items[itemId] : 0;
    };
    Game_Party.prototype.weaponCount = function (weaponId) {
        return this._weapons[weaponId] ? this._weapons[weaponId] : 0;
    };
    Game_Party.prototype.armorCount = function (armorId) {
        return this._armors[armorId] ? this._armors[armorId] : 0;
    };
    // 向菜单添加合成命令
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if (EnabledMenuAlchemy)
            this.addCommand(MenuAlchemyText, "alchemy", this.isEnabledAlchemy());
    };
    Window_MenuCommand.prototype.isEnabledAlchemy = function () {
        if (EnabledAlchemySwitchId === 0)
            return true;
        return $gameSwitches.value(EnabledAlchemySwitchId);
    };
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("alchemy", this.alchemy.bind(this));
    };
    Scene_Menu.prototype.alchemy = function () {
        SceneManager.push(Scene_Alchemy);
    };
    // 注册插件命令
    if (Utils.RPGMAKER_NAME === "MZ") {
        PluginManager.registerCommand(AlchemySystemPluginName, "StartAlchemyScene", () => {
            SceneManager.push(Scene_Alchemy);
        });
    }
    else {
        const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command === "AlchemySystem" && args[0] === "StartAlchemyScene") {
                SceneManager.push(Scene_Alchemy);
            }
        };
    }
})(AlchemySystem || (AlchemySystem = {}));
const AlchemyClassAlias = AlchemySystem;