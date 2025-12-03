document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    // 1. 收集所有表单数据
    const formData = {
        timestamp: new Date().toISOString(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        country: document.getElementById('country').value,
        // 获取选中的评分单选按钮的值
        rating: document.querySelector('input[name="rating"]:checked')?.value || '未选择',
        feedback: document.getElementById('feedback').value,
        format: document.getElementById('format').value,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // 2. 根据选择的格式生成文件内容和文件名
    let content, mimeType, fileName;
    const timeStamp = new Date().toLocaleString('zh-CN', {hour12: false}).replace(/[/:\\]/g, '-');

    switch(formData.format) {
        case 'json':
            content = JSON.stringify(formData, null, 2); // 缩进2个空格，美观
            mimeType = 'application/json';
            fileName = `问卷数据_${timeStamp}.json`;
            break;
        case 'csv':
            // 简单地将对象转换为CSV行
            const headers = ['字段', '值'];
            const rows = Object.entries(formData).map(([key, val]) => `"${key}","${val}"`);
            content = [headers.join(','), ...rows].join('\n');
            mimeType = 'text/csv';
            fileName = `问卷数据_${timeStamp}.csv`;
            break;
        case 'txt':
        default:
            content = Object.entries(formData).map(([key, val]) => `${key}: ${val}`).join('\n');
            mimeType = 'text/plain';
            fileName = `问卷数据_${timeStamp}.txt`;
    }

    // 3. 创建可下载的文件并触发下载[citation:3]
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8`});
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    // 将链接添加到页面，模拟点击，然后移除
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 释放内存
    URL.revokeObjectURL(downloadUrl);

    // 4. (可选) 提供成功反馈
    alert(`感谢提交！数据文件“${fileName}”已开始下载。`);
    // 轻度重置表单
    // this.reset(); // 如需清空表单可取消注释
});
