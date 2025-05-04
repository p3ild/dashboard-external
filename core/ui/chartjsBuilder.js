import _ from "lodash";
const { set, get } = _;
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const chartBuilder = (chartConfig) => {

    //Responsive
    set(chartConfig, 'options.maintainAspectRatio', false);
    set(chartConfig, 'options.responsive', true);

    //Layout
    set(chartConfig, 'options.layout', {
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    });

    //Position arrow
    set(chartConfig, 'options.interaction.mode', 'nearest');

    //Legend
    set(chartConfig, 'options.plugins.legend', {
        position: 'bottom',
       
        labels: {
            usePointStyle: true,
            boxWidth: 30
          }
    })

    //titleChart
    set(chartConfig, 'options.plugins.title', {
        position: 'top',
        display: true,
        ...get(chartConfig, 'options.plugins.title')
    })

    //DataLabels
    set(chartConfig, 'plugins', [ChartDataLabels])
    set(chartConfig, 'options.plugins.datalabels', {
        backgroundColor: 'rgba(0, 0, 0, .10)',
        color: '#fff',
        borderRadius: 1,
        padding: 2,
        font: function (context) {
            var w = context.chart.width;
            return {
                size: w < 512 ? 4 : 12,
            };
        },
        ...get(chartConfig, 'options.plugins.datalabels'),
    });

    //Tooltip
    set(chartConfig, 'options.plugins.tooltip.titleFont', {
        size: 18
    });
    set(chartConfig, 'options.plugins.tooltip.bodyFont', {
        size: 18
    });

    //Ticks label
    set(chartConfig, 'options.scales.x.ticks', {
        minRotation: 30,
        maxRotation: 80,
        // padding: 2,
        autoSkip: false,
        fontSize: '3px'
    });
    set(chartConfig, 'options.scales.x.grid', {
        display: false
    });

    set(chartConfig, 'options.scales.y', {
        beginAtZero: true,
        ...get(chartConfig, 'options.scales.y')
    });



    return chartConfig
}