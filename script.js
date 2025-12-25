class BirthdaySurprise {
    constructor() {
        this.audio = {
            bg: document.getElementById('bgMusic'),
            song: document.getElementById('birthdaySong'),
            sfx: document.getElementById('candleSfx')
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.startSequence();
    }

    startSequence() {
        // 1. 开始背景钢琴
        document.addEventListener('click', () => {
            this.audio.bg.volume = 0.5;
            this.audio.bg.play();
        }, { once: true });

        // 2. 3秒后启动粒子动画 (TO WXJ -> HBD)
        setTimeout(() => {
            document.getElementById('particleStage').classList.add('stage-active');
            if (window.startParticleAnimation) window.startParticleAnimation();
        }, 3000);

        // 3. 12秒后（等待粒子播完）开始搭蛋糕
        setTimeout(() => {
            document.getElementById('particleStage').classList.remove('stage-active');
            document.getElementById('cakeStage').classList.add('stage-active');
            this.buildCake();
        }, 12000);
    }

    buildCake() {
        // 获取所有蛋糕层级，并反转数组顺序，确保从底层(layer-1)开始动画
        const layers = Array.from(document.querySelectorAll('.layer')).reverse();
        
        layers.forEach((layer, i) => {
            setTimeout(() => {
                layer.classList.add('animate');
            }, i * 600); // 每层间隔0.6秒，让叠加更连贯
        });

        // 搭完最后一张(顶层)后显示蜡烛
        setTimeout(() => {
            document.getElementById('candleBox').style.opacity = '1';
            this.audio.bg.pause();
            this.audio.song.play();
        }, layers.length * 600 + 400);
    }

    blowCandle() {
        document.getElementById('candleFlame').classList.add('blown-out');
        document.getElementById('candleHint').style.opacity = '0';
        this.audio.sfx.play();
        
        // 喷射蓝色/绿色/白色系彩带
        confetti({ 
            particleCount: 150, 
            spread: 80, 
            origin: { y: 0.6 }, 
            colors: ['#007AFF', '#66BB6A', '#FFFFFF'] 
        });

        // 1.5秒后弹出 iOS 信件
        setTimeout(() => {
            document.getElementById('envelopeOverlay').classList.add('active');
        }, 1500);
    }

    bindEvents() {
        document.getElementById('candleFlame').onclick = () => this.blowCandle();
        
        // 信件关闭逻辑 -> 弹礼物
        document.getElementById('envelopeOverlay').onclick = (e) => {
            // 兼容你 HTML 中的类名 imessage-footer
            if (e.target.id === 'envelopeOverlay' || e.target.className === 'imessage-footer') {
                document.getElementById('envelopeOverlay').classList.remove('active');
                document.getElementById('envelopeIcon').classList.add('active');
                // 自动接着弹礼物盒
                setTimeout(() => document.getElementById('giftOverlay').classList.add('active'), 800);
            }
        };

        // 礼物盒打开 (对应你 HTML 中的 flat-gift-box)
        document.getElementById('giftBoxTrigger').onclick = () => {
            document.getElementById('giftBoxTrigger').classList.add('open');
        };

        // 礼物盒关闭
        document.getElementById('giftOverlay').onclick = (e) => {
            if (e.target.id === 'giftOverlay') {
                document.getElementById('giftOverlay').classList.remove('active');
                document.getElementById('giftIcon').classList.add('active');
            }
        };

        // 右上角图标重开功能
        document.getElementById('envelopeIcon').onclick = () => document.getElementById('envelopeOverlay').classList.add('active');
        document.getElementById('giftIcon').onclick = () => document.getElementById('giftOverlay').classList.add('active');
    }
}

window.onload = () => { new BirthdaySurprise(); };