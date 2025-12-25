window.startParticleAnimation = function() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleSize = 1.2;
    
    // 存储两段文字的坐标点
    let firstTextPoints = [];
    let secondTextPoints = [];

    function getPoints(text, fontSize) {
        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        
        tmpCtx.fillStyle = 'white';
        tmpCtx.textAlign = "center";
        tmpCtx.textBaseline = "middle";
        tmpCtx.font = `bold ${fontSize}px Arial`;
        tmpCtx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const data = tmpCtx.getImageData(0, 0, canvas.width, canvas.height).data;
        const points = [];
        const gap = 4; // 采样间距
        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                    points.push({ x, y });
                }
            }
        }
        return points;
    }

    function init() {
        // 1. 获取两组文字的坐标
        firstTextPoints = getPoints("TO WXJ", 90);
        secondTextPoints = getPoints("HAPPY BIRTHDAY", 80);

        // 2. 以数量较多的一组为基准创建粒子
        const maxParticles = Math.max(firstTextPoints.length, secondTextPoints.length);
        
        for (let i = 0; i < maxParticles; i++) {
            // 如果第一组点不够了，就随机重复取点，保证动画平滑
            const p1 = firstTextPoints[i % firstTextPoints.length];
            const p2 = secondTextPoints[i % secondTextPoints.length];

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                tx: p1.x, // 初始目标是第一段文字
                ty: p1.y,
                target1: { x: p1.x, y: p1.y },
                target2: { x: p2.x, y: p2.y },
                color: `hsl(${Math.random() * 40 + 20}, 100%, 65%)`,
                speed: Math.random() * 0.07 + 0.03
            });
        }

        // 3. 4.5秒后切换到第二段文字
        setTimeout(() => {
            particles.forEach(p => {
                p.tx = p.target2.x;
                p.ty = p.target2.y;
                // 稍微抖动一下，增加散开效果
                p.x += (Math.random() - 0.5) * 50;
                p.y += (Math.random() - 0.5) * 50;
            });
        }, 4500);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += (p.tx - p.x) * p.speed;
            p.y += (p.ty - p.y) * p.speed;
            
            const alpha = 0.4 + Math.random() * 0.6;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
};

// --- 星空背景 (保持不变) ---
const starCanvas = document.getElementById('starCanvas');
if(starCanvas) {
    const sCtx = starCanvas.getContext('2d');
    let stars = [];
    function initStars() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        stars = [];
        for(let i=0; i<150; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                size: Math.random() * 1.5,
                blinkSpeed: 0.02 + Math.random() * 0.03,
                alpha: Math.random(),
                dir: 1
            });
        }
    }
    function drawStars() {
        sCtx.clearRect(0,0,starCanvas.width, starCanvas.height);
        stars.forEach(s => {
            s.alpha += s.blinkSpeed * s.dir;
            if(s.alpha > 1 || s.alpha < 0) s.dir *= -1;
            sCtx.globalAlpha = Math.max(0, s.alpha);
            sCtx.fillStyle = 'white';
            sCtx.beginPath();
            sCtx.arc(s.x, s.y, s.size, 0, Math.PI*2);
            sCtx.fill();
        });
        requestAnimationFrame(drawStars);
    }
    initStars();
    drawStars();
}