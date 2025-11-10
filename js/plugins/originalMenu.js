//=============================================================================
// originalMenu.js
//=============================================================================

/*:ja
 * @plugindesc カスタムメニュー画面を実装します。
 * @author Kanji the Grass
 *
 * @param backGroundImage
 * @default 5
 *
 * @param ImageWidth
 * @type number
 * @default 150
 *
 * @param ImageHeight
 * @type number
 * @default 60
 *
 * @param CommandOffsetX
 * @text 命令整体X偏移
 * @desc 所有命令选项的整体X坐标偏移量
 * @type number
 * @default -100
 *
 * @param CommandOffsetY
 * @text 命令整体Y偏移
 * @desc 所有命令选项的整体Y坐标偏移量
 * @type number
 * @default 0
 */

/*:
 * @plugindesc 简易解密独特主菜单[v1.1]
 * @author 莞爾の草
 *
 * @param backGroundImage
 * @text 名称变量ID
 * @desc 要在背景中显示的图像名称的变量ID（该图像必须在系统中）
 * @default 5
 *
 * @param ImageWidth
 * @text 图像宽度
 * @desc 命令的图像宽度。影响可点击区域
 * @type number
 * @default 150
 *
 * @param ImageHeight
 * @text 图像高度
 * @desc 命令的图像高度。影响命令之间的空间大小
 * @type number
 * @default 70
 *
 * @param CommandOffsetX
 * @text 命令整体X偏移
 * @desc 所有命令选项的整体X坐标偏移量
 * @type number
 * @default -70
 *
 * @param CommandOffsetY
 * @text 命令整体Y偏移
 * @desc 所有命令选项的整体Y坐标偏移量
 * @type number
 * @default 0
 *
 * @help
 
 * 1. 命令图像命名为command0、command1...放在img/system文件夹
 * 2. 背景图像通过变量指定，设置方式不变
 * 3. 新增读档功能，需要添加command4图像（对应读档命令）
 * 4. 可通过CommandOffsetX和CommandOffsetY参数调整所有命令的整体位置
 
 
 汉化/修正：硕明云书
 1、增加命令整体偏移
 2、增加读档
 
 
 可用于简易解密游戏菜单效果，可用于商业游戏制作
 商用需署名插件作者
 
 */

(function() {
    var parameters = PluginManager.parameters('originalMenu');
    var bgImageId = String(parameters['backGroundImage'] || "1"),
    imageWidth = parseInt(parameters['ImageWidth'] || 208),
    imageHeight = parseInt(parameters['ImageHeight'] || 48),
    commandOffsetX = parseInt(parameters['CommandOffsetX'] || 0),
    commandOffsetY = parseInt(parameters['CommandOffsetY'] || 0);

    // 增加读档命令
    var _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        _Window_MenuCommand_makeCommandList.call(this);
        // 添加读档命令
        this.addCommand('读档', 'load', this.isLoadEnabled());
    };

    // 检查读档是否可用
    Window_MenuCommand.prototype.isLoadEnabled = function() {
        return DataManager.isAnySavefileExists();
    };

    // 处理读档命令
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('load', this.commandLoad.bind(this));
    };

    // 执行读档
    Scene_Menu.prototype.commandLoad = function() {
        SceneManager.push(Scene_Load);
    };

    Window_MenuCommand.prototype.itemTextAlign = function() {
        return 'center';
    };

    Window_MenuCommand.prototype.windowWidth = function () {
        return imageWidth + this.standardPadding() * 2;
    }

    Window_MenuCommand.prototype.lineHeight = function() {
        return imageHeight;
    };

    Window_MenuCommand.prototype.drawItem = function(index) {};

    const _oldCreateBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function() {
        _oldCreateBackground.call(this);
        this._bgSprite = new Sprite(ImageManager.loadSystem($gameVariables.value(bgImageId)));
        this._bgSprite.x = Graphics.boxWidth / 2;
        this._bgSprite.y = Graphics.boxHeight / 2;
        this._bgSprite.opacity = 0;
        this._bgSprite.anchor.x = this._bgSprite.anchor.y = 0.5;
        this.addChild(this._bgSprite);
    };

    const _oldCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _oldCommandWindow.call(this);
        this._commandWindow.visible = false;
        // 应用整体偏移量
        this._commandWindow.x = (Graphics.boxWidth - this._commandWindow.width) / 2 + commandOffsetX;
        this._commandWindow.y = (Graphics.boxHeight - this._commandWindow.height) / 2 + commandOffsetY;
        this._commandSprites = [];
        this._comMax = this._commandWindow.maxItems();
        this._comCentral = parseInt(Graphics.boxWidth / 2) + commandOffsetX; // 加入X偏移
        for (var i = 0; i < this._comMax; i++) {
            var sp = new Sprite(ImageManager.loadSystem("command" + i));
            sp.bitmap.smooth = true;
            sp.x = i % 2 == 0 ? -400 + commandOffsetX : Graphics.boxWidth + 400 + commandOffsetX;
            sp.kanjiSpecialFadeIn = 0;
            sp.anchor.x = 0.5;
            // 加入Y偏移
            sp.y = this._commandWindow.itemRect(i).y + this._commandWindow.y + 
                   this._commandWindow.standardPadding() + commandOffsetY;
            this.addChild(sp);
            this._commandSprites.push(sp);
        }
    }

    const _oldUpdate = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
        _oldUpdate.call(this);
        if (this._bgSprite && this._bgSprite.opacity < 255) this._bgSprite.opacity += 28;

        var max = 14;
        for (var i = 0; i < this._comMax; i++) {
            var sp = this._commandSprites[i];
            if (sp.kanjiSpecialFadeIn < max) {
                sp.x = (this._comCentral - sp.x) * (++sp.kanjiSpecialFadeIn / max) + sp.x;
            }
            if (this._commandWindow._index == i) {
                if (sp.opacity < 255) sp.opacity += 14;
                if (sp.scale.x < 1) sp.scale.x += 0.125;
            } else {
                if (sp.opacity > 144) sp.opacity -= 14;
                if (sp.scale.x > 0.875) sp.scale.x -= 0.125;
            }
        }
    };
    
    const _oldCreateGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Menu.prototype.createGoldWindow = function() {
        _oldCreateGoldWindow.call(this);
        this._goldWindow.visible = false;
    };
    
    const _oldCreateStatusWindow = Scene_Menu.prototype.createStatusWindow;
    Scene_Menu.prototype.createStatusWindow = function() {
        _oldCreateStatusWindow.call(this);
        this._statusWindow.visible = false;
    };
})();