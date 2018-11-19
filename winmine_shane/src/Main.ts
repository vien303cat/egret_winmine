class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin 
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        //this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;

    private bomb: Array<Array<number>> = [];  //地雷資料
    private btn: Array<Array<eui.Button>> = []; //按鈕資料
    private ifbtn: boolean = false;
    /**
     * 创建场景界面
     * Create scene interface
     */

    protected createGameScene(): void {
        // let sky = this.createBitmapByName("bg_jpg");
        // this.addChild(sky);
        let sbutton = new eui.Button();                 //開始按鈕設置
        let btname = "start";
        sbutton.x = 100;
        sbutton.y = this.stage.stageWidth + 20;
        sbutton.width = 200;
        sbutton.height = 100;
        sbutton.name = btname;
        sbutton.label = "GAME START!";
        sbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gamestart, this);  //點擊事件
        this.addChild(sbutton);

        // if(sbutton.hasEventListener(egret.TouchEvent.TOUCH_TAP) == true){
        //     this.removeChild(sbutton);
        // }
    }

    private gamestart(event: egret.TouchEvent): void {
        //畫格子 10*10
        
        if (this.bomb.length != 0) {                //若開始時已經有了資料時，清空所有資料
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let nun = i * 10 + j;
                    this.btn = [];
                    this.bomb = [];
                    this.ifclick = [];
                }
            }
            this.fail = false;
            this.win = false;
            this.failtime = 0;
            this.wintime = 0;
            let re_shape: egret.Shape = new egret.Shape();    //重新開始遮罩
            re_shape.graphics.beginFill(0x888888);
            re_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            re_shape.graphics.endFill();
            this.addChild(re_shape);
        }

        for (let i = 0; i < 10; i++) {
            this.btn.push(new Array<eui.Button>());
            for (let j = 0; j < 10; j++) {
                let button = new eui.Button();
                let btname = i * 10 + j;
                button.x = j * 60;
                button.y = i * 60;
                button.width = 60;
                button.height = 60;
                button.name = String(btname);  //格子名稱為0~99
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bombclick, this);
                this.addChild(button);
                this.btn[i].push(button);
                console.log(this.btn[i]);
            }
        }

        // 決定好地雷位置  
        for (let i = 0; i < 10; i++) {
            this.bomb.push(new Array<number>());    //將bomb陣列變數在每一欄塞進一個陣列變成二維的
            for (let j = 0; j < 10; j++) {
                this.bomb[i].push(0);               //將裡面的數字塞進0
            }
        }
        let hmbomb: number = 10; //炸彈總數
        while (true) {              //添加炸彈進二維陣列、並且讓bomb炸彈資料裡面分為0(數字)跟10(炸彈)兩種
            if (hmbomb <= 0) {      //若添加炸彈數剩0則跳出迴圈
                break;
            }
            let x = Math.floor(Math.random() * 9) + 1;  //0~9隨機
            let y = Math.floor(Math.random() * 9) + 1;
            if (this.bomb[x][y] != 0) {
                continue;
            } else {
                this.bomb[x][y] = 10;
                hmbomb -= 1;
            }
        }

        //計算每一格周圍地雷 
        for (let i = 0; i <= 9; i++) {
            for (let j = 0; j <= 9; j++) {
                let aroundbomb = 0;
                for (let ibomb = -1; ibomb <= 1; ibomb++) { //上下
                    for (let jbomb = -1; jbomb <= 1; jbomb++) { //左右
                        let ib = i + ibomb;     //加起來即能夠讀到九宮格
                        let jb = j + jbomb;
                        if (ib < 0)           //邊緣的不用算
                            continue;
                        if (ib > 9)
                            continue;
                        if (jb < 0)
                            continue;
                        if (jb > 9)
                            continue;
                        if (this.bomb[ib][jb] == 10) {    // 10即為炸彈
                            aroundbomb += 1;
                        }
                    }
                }
                if (this.bomb[i][j] == 10) {  //若是地雷則跳過
                    continue;
                } else {
                    this.bomb[i][j] = aroundbomb;       //每格算完之後將陣列數字0改為相對應周圍炸彈數字
                }
            }

        }
        //console.log(this.bomb);
    }
    private bombclick(event: egret.TouchEvent): void {  //按鈕點擊事件
        console.log(event.target.name, "button touched!!");
        let bt = parseInt(event.target.name);   //parseInt 將物件轉為int (可以計算之類的)
        let bti = parseInt((bt / 10).toString());
        let btj = bt % 10;
        // console.log("[i] = ", bti, " [j] = ", btj);  測試

        if (this.bomb[bti][btj] < 0) return;  //已經開啟過的按鈕 
        let bt_data = this.bomb[bti][btj];
        if (this.bomb[bti][btj] > 0 && this.bomb[bti][btj] < 9) {  //按到非0數字
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
    }
    private failtime: number = 0;       //踩到地雷次數
    private fail: boolean = false;
    private wintime: number = 0;        //踩到安全區次數
    private win: boolean = false;
    private ifclick: Array<Array<number>> = [];     //數值是否顯示的陣列


    private update_ui() {                               //畫面更新函式
        for (let i = 0; i < 10; i++) {
            this.ifclick.push(new Array<number>());
            for (let j = 0; j < 10; j++) {
                this.ifclick[i].push(0);                //將是否顯示的按鈕陣列填滿0
                let bt_data = this.btn[i][j];
                let bomb_data = this.bomb[i][j];
                // if (bomb_data > 0) {
                //     bt_data.enabled = true;
                //     continue;
                // }
                if (this.ifclick[i][j] == 0) {          //判斷是否顯示，沒有顯示的按鈕為0 ; 有顯示的按鈕為1
                    if (bomb_data < 0 && bomb_data > -8) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = (-bomb_data).toString();
                        this.wintime += 1;              //計算開到的安全區數量
                        continue;
                    }
                    if (bomb_data == -9) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = "0";
                        this.wintime += 1;           //計算開到的安全區數量
                        this.bomb[i][j] = -100;
                        this.zero(i, j);             //若抓到0 則將0的數值改為-100，下次才不會又重新讀一次，並且將該0的位置傳至zero函式
                        continue;
                    }
                    if (bomb_data == -10) {
                        this.ifclick[i][j] = 1;
                        bt_data.enabled = false;
                        bt_data.label = "X";
                        this.failtime += 1;            //計算開到的地雷數量
                        continue;
                    }
                }
            }
        }
        this.ifend();
    }


    private zero(zi, zj) {                  //若開到0時的函式:抓九宮格內排除邊緣的格子
        //console.log(zi, "/////", zj);   測試
        for (let ibomb = -1; ibomb <= 1; ibomb++) { //上下
            for (let jbomb = -1; jbomb <= 1; jbomb++) { //左右
                let ib = zi + ibomb;     //加起來即能夠讀到九宮格
                let jb = zj + jbomb;
                if (ib < 0)           //排除邊緣
                    continue;
                if (ib > 9)
                    continue;
                if (jb < 0)
                    continue;
                if (jb > 9)
                    continue;

                //console.log("[i] = ", ib, " [j] = ", jb);     測試
                if (this.bomb[ib][jb] > 0 && this.bomb[ib][jb] < 9) {
                    this.bomb[ib][jb] = -this.bomb[ib][jb];     //將值改為"已顯式的數字"
                    this.update_ui();               //執行更新畫面函式
                }
                if (this.bomb[ib][jb] == 0) {
                    this.bomb[ib][jb] = -9;         //將值改為"已顯式的0"
                    this.update_ui();               //執行更新畫面函式
                }
            }
        }

    }

    private ifend() {                   //判斷是否失敗或勝利
        if (this.failtime == 3) {       //設定踩到幾次會失敗
            this.fail = true;
        }
        if (this.wintime >= 90) {       //設定安全區格子數
            this.win = true;
        }
        if (this.win == true) {   //成功畫面
            let win_shape: egret.Shape = new egret.Shape();
            win_shape.graphics.beginFill(0xffffff);
            win_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            win_shape.graphics.endFill();
            let wintext: egret.TextField = new egret.TextField();
            wintext.textColor = (0x000000);
            wintext.text = "贏了!";
            wintext.fontFamily = "KaiTi";
            wintext.x = this.stage.width / 3;
            wintext.y = this.stage.width / 3;
            wintext.size = 100;
            this.addChild(win_shape);
            this.addChild(wintext);
        } else {

        }
        if (this.fail == true) {   //失敗畫面
            let lose_shape: egret.Shape = new egret.Shape();
            lose_shape.graphics.beginFill(0x000000);
            lose_shape.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageWidth);
            lose_shape.graphics.endFill();
            let losetext: egret.TextField = new egret.TextField();
            losetext.textColor = (0xffffff);
            losetext.text = "失敗!";
            losetext.fontFamily = "KaiTi";
            losetext.x = this.stage.width / 3;
            losetext.y = this.stage.width / 3;
            losetext.size = 100;
            this.addChild(lose_shape);
            this.addChild(losetext);
        }
    }



    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}
