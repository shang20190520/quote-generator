document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('text-input');
    const fontSelect = document.getElementById('font-select');
    const textColor = document.getElementById('text-color');
    const downloadBtn = document.getElementById('download-btn');
    const colorBtns = document.querySelectorAll('.color-btn');
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const bgImageInput = document.getElementById('bg-image');
    const removeBgImageBtn = document.getElementById('remove-bg-image');

    // 设置画布大小
    canvas.width = 800;
    canvas.height = 600;

    // 当前选中的背景色
    let currentBgColor = '#FFB5B5';

    // 背景图片对象
    let backgroundImage = null;

    // 更新预览
    function updatePreview() {
        // 清空画布
        ctx.fillStyle = currentBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 如果有背景图片，绘制背景图片
        if (backgroundImage) {
            // 计算图片缩放比例以覆盖整个画布
            const scale = Math.max(
                canvas.width / backgroundImage.width,
                canvas.height / backgroundImage.height
            );
            const scaledWidth = backgroundImage.width * scale;
            const scaledHeight = backgroundImage.height * scale;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;

            ctx.drawImage(backgroundImage, x, y, scaledWidth, scaledHeight);
        }

        // 设置文字样式
        const fontSize = parseInt(fontSizeInput.value);
        ctx.font = `${fontSize}px ${fontSelect.value}`;
        ctx.fillStyle = textColor.value;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 绘制文字
        const lines = textInput.value.split('\n');
        const lineHeight = fontSize * 1.5;
        const startY = canvas.height/2 - (lines.length - 1) * lineHeight/2;

        // 为文字添加描边效果，使其在任何背景上都清晰可见
        lines.forEach((line, index) => {
            const y = startY + index * lineHeight;
            // 绘制文字描边
            ctx.strokeStyle = 'white';
            ctx.lineWidth = fontSize / 15;
            ctx.strokeText(line, canvas.width/2, y);
            // 绘制文字
            ctx.fillText(line, canvas.width/2, y);
        });
    }

    // 事件监听
    textInput.addEventListener('input', updatePreview);
    fontSelect.addEventListener('change', updatePreview);
    textColor.addEventListener('input', updatePreview);

    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentBgColor = getComputedStyle(btn).backgroundColor;
            updatePreview();
        });
    });

    // 下载功能
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = '金句图片.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // 更新字体大小显示
    fontSizeInput.addEventListener('input', function() {
        fontSizeValue.textContent = this.value + 'px';
        updatePreview();
    });

    // 处理背景图片上传
    bgImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    backgroundImage = img;
                    updatePreview();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 移除背景图片
    removeBgImageBtn.addEventListener('click', function() {
        backgroundImage = null;
        bgImageInput.value = '';
        updatePreview();
    });

    // 初始预览
    updatePreview();
}); 