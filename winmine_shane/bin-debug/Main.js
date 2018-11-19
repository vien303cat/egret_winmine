var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bomb = []; //地雷資料
        _this.btn = []; //按鈕資料
        _this.ifbtn = false;
        _this.failtime = 0; //踩到地雷次數
        _this.fail = false;
        _this.wintime = 0; //踩到安全區次數
        _this.win = false;
        _this.ifclick = []; //數值是否顯示的陣列
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin 
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")
                            //this.startAnimation(result);
                        ];
                    case 2:
                        result = _a.sent();
                        //this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        //this.startAnimation(result);
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        // let sky = this.createBitmapByName("bg_jpg");
        // this.addChild(sky);
        var sbutton = new eui.Button(); //開始按鈕設置
        var btname = "start";
        sbutton.x = 100;
        sbutton.y = this.stage.stageWidth + 20;
        sbutton.width = 200;
        sbutton.height = 100;
        sbutton.name = btname;
        sbutton.label = "GAME START!";
        sbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gamestart, this); //點擊事件
        this.addChild(sbutton);
        // if(sbutton.hasEventListener(egret.TouchEvent.TOUCH_TAP) == true){
        //     this.removeChild(sbutton);
        // }
    };
    Main.prototype.gamestart = function (event) {
        //畫格子 10*10
        if (this.bomb.length != 0) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var nun = i * 10 + j;
                    this.btn = [];
                    this.bomb = [];
                    this.ifclick = [];
                }
            }
            this.fail = false;
            this.win = false;
            this.failtime = 0;
            this.wintime = 0;
            var re_shape = new egret.Shape(); //重新開始遮罩
            re_shape.graphics.beginFill(0x888888);
            re_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            re_shape.graphics.endFill();
            this.addChild(re_shape);
        }
        for (var i = 0; i < 10; i++) {
            this.btn.push(new Array());
            for (var j = 0; j < 10; j++) {
                var button = new eui.Button();
                var btname = i * 10 + j;
                button.x = j * 60;
                button.y = i * 60;
                button.width = 60;
                button.height = 60;
                button.name = String(btname); //格子名稱為0~99
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bombclick, this);
                this.addChild(button);
                this.btn[i].push(button);
                console.log(this.btn[i]);
            }
        }
        // 決定好地雷位置  
        for (var i = 0; i < 10; i++) {
            this.bomb.push(new Array()); //將bomb陣列變數在每一欄塞進一個陣列變成二維的
            for (var j = 0; j < 10; j++) {
                this.bomb[i].push(0); //將裡面的數字塞進0
            }
        }
        var hmbomb = 10; //炸彈總數
        while (true) {
            if (hmbomb <= 0) {
                break;
            }
            var x = Math.floor(Math.random() * 9) + 1; //0~9隨機
            var y = Math.floor(Math.random() * 9) + 1;
            if (this.bomb[x][y] != 0) {
                continue;
            }
            else {
                this.bomb[x][y] = 10;
                hmbomb -= 1;
            }
        }
        //計算每一格周圍地雷 
        for (var i = 0; i <= 9; i++) {
            for (var j = 0; j <= 9; j++) {
                var aroundbomb = 0;
                for (var ibomb = -1; ibomb <= 1; ibomb++) {
                    for (var jbomb = -1; jbomb <= 1; jbomb++) {
                        var ib = i + ibomb; //加起來即能夠讀到九宮格
                        var jb = j + jbomb;
                        if (ib < 0)
                            continue;
                        if (ib > 9)
                            continue;
                        if (jb < 0)
                            continue;
                        if (jb > 9)
                            continue;
                        if (this.bomb[ib][jb] == 10) {
                            aroundbomb += 1;
                        }
                    }
                }
                if (this.bomb[i][j] == 10) {
                    continue;
                }
                else {
                    this.bomb[i][j] = aroundbomb; //每格算完之後將陣列數字0改為相對應周圍炸彈數字
                }
            }
        }
        //console.log(this.bomb);
    };
    Main.prototype.bombclick = function (event) {
        console.log(event.target.name, "button touched!!");
        var bt = parseInt(event.target.name); //parseInt 將物件轉為int (可以計算之類的)
        var bti = parseInt((bt / 10).toString());
        var btj = bt % 10;
        // console.log("[i] = ", bti, " [j] = ", btj);  測試
        if (this.bomb[bti][btj] < 0)
            return; //已經開啟過的按鈕 
        var bt_data = this.bomb[bti][btj];
        if (this.bomb[bti][btj] > 0 && this.bomb[bti][btj] < 9) {
            this.bomb[bti][btj] = -this.bomb[bti][btj];
            this.update_ui();
            return;
        }
        if (this.bomb[bti][btj] == 10) {
            this.bomb[bti][btj] = -10;
            // event.target.source="bomb_png"; 
            alert("Bomb!!");
            this.update_ui();
            return;
        }
        if (this.bomb[bti][btj] == 0) {
            this.bomb[bti][btj] = -9;
            this.update_ui();
            return;
        }
    };
    Main.prototype.update_ui = function () {
        for (var i = 0; i < 10; i++) {
            this.ifclick.push(new Array());
            for (var j = 0; j < 10; j++) {
                this.ifclick[i].push(0); //將是否顯示的按鈕陣列填滿0
                var bt_data = this.btn[i][j];
                var bomb_data = this.bomb[i][j];
                // if (bomb_data > 0) {
                //     bt_data.enabled = true;
                //     continue;
                // }
                if (this.ifclick[i][j] == 0) {
                    if (bomb_data < 0 && bomb_data > -8) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = (-bomb_data).toString();
                        this.wintime += 1; //計算開到的安全區數量
                        continue;
                    }
                    if (bomb_data == -9) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = "0";
                        this.wintime += 1; //計算開到的安全區數量
                        this.bomb[i][j] = -100;
                        this.zero(i, j); //若抓到0 則將0的數值改為-100，下次才不會又重新讀一次，並且將該0的位置傳至zero函式
                        continue;
                    }
                    if (bomb_data == -10) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = "X";
                        this.failtime += 1; //計算開到的地雷數量
                        continue;
                    }
                }
            }
        }
        this.ifend();
    };
    Main.prototype.zero = function (zi, zj) {
        //console.log(zi, "/////", zj);   測試
        for (var ibomb = -1; ibomb <= 1; ibomb++) {
            for (var jbomb = -1; jbomb <= 1; jbomb++) {
                var ib = zi + ibomb; //加起來即能夠讀到九宮格
                var jb = zj + jbomb;
                if (ib < 0)
                    continue;
                if (ib > 9)
                    continue;
                if (jb < 0)
                    continue;
                if (jb > 9)
                    continue;
                //console.log("[i] = ", ib, " [j] = ", jb);     測試
                if (this.bomb[ib][jb] > 0 && this.bomb[ib][jb] < 9) {
                    this.bomb[ib][jb] = -this.bomb[ib][jb]; //將值改為"已顯式的數字"
                    this.update_ui(); //執行更新畫面函式
                }
                if (this.bomb[ib][jb] == 0) {
                    this.bomb[ib][jb] = -9; //將值改為"已顯式的0"
                    this.update_ui(); //執行更新畫面函式
                }
            }
        }
    };
    Main.prototype.ifend = function () {
        if (this.failtime == 3) {
            this.fail = true;
        }
        if (this.wintime >= 90) {
            this.win = true;
        }
        if (this.win == true) {
            var win_shape = new egret.Shape();
            win_shape.graphics.beginFill(0xffffff);
            win_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            win_shape.graphics.endFill();
            var wintext = new egret.TextField();
            wintext.textColor = (0x000000);
            wintext.text = "贏了!";
            wintext.fontFamily = "KaiTi";
            wintext.x = this.stage.width / 3;
            wintext.y = this.stage.width / 3;
            wintext.size = 100;
            this.addChild(win_shape);
            this.addChild(wintext);
        }
        else {
        }
        if (this.fail == true) {
            var lose_shape = new egret.Shape();
            lose_shape.graphics.beginFill(0x000000);
            lose_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            lose_shape.graphics.endFill();
            var losetext = new egret.TextField();
            losetext.textColor = (0xffffff);
            losetext.text = "失敗!";
            losetext.fontFamily = "KaiTi";
            losetext.x = this.stage.width / 3;
            losetext.y = this.stage.width / 3;
            losetext.size = 100;
            this.addChild(lose_shape);
            this.addChild(losetext);
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map