function PaintChart() {
    const chart = echarts.init(document.getElementById('chart'));
    // 获取父容器宽度
    // 获取父容器宽度
    const parentWidth = document.getElementById('chart').style.width;
    chart.resize({ width: parentWidth });
    // 设置图表宽度为父容器宽度
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#f8f9fa'
                }
            }
        },
        legend: {
            data: ['高度 (m)', '速度 (km/h)'],
            top: 20,
            left: 'center',
            textStyle: {
                fontSize: 14,
                color: '#333'
            }
        },
        grid: {
            top: '25%',
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['10:30', '11:08', '11:46', '12:24', '13:02', '13:41', '14:26','15:18'],
            axisLabel: {
                fontSize: 12,
                color: '#666',
                rotate: 45
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [
            {
                type: 'value',
                position: 'left',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#333'
                },
                axisLabel: {
                    fontSize: 12,
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            },
            {
                type: 'value',
                position: 'right',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#333'
                },
                axisLabel: {
                    fontSize: 12,
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                type: 'line',
                name: '高度 (m)',
                data: [13000, 9750, 6500, 3250, 0, 0],
                smooth: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00FF00' },
                        { offset: 1, color: '#66FF99' }
                    ])
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 255, 0, 0.5)' },
                        { offset: 1, color: 'rgba(102, 255, 153, 0.1)' }
                    ])
                },
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },

            },
            {
                type: 'line',
                name: '速度 (km/h)',
                yAxisIndex: 1,
                data: [1100, 825, 550, 275, 0, 0],
                smooth: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#FFA500' },
                        { offset: 1, color: '#FF8C00' }
                    ])
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 165, 0, 0.5)' },
                        { offset: 1, color: 'rgba(255, 140, 0, 0.1)' }
                    ])
                },
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },

            }
        ]
    };

    chart.setOption(option);
}