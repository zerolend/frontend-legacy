import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = () => {
  const options = {
    credits: {
      enabled: false,
    },
    color: {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, '#003399'],
        [1, '#3366AA'],
      ],
    },
    chart: {
      type: 'area',
      height: '550',
      backgroundColor: 'transparent',
      events: {
        load: function (this) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const chart: any = this;
          const series = chart.series[0];
          const points = series.points;

          const pointsToUpdate = [
            3, // by x position of them
          ];

          points.forEach(function (point: any) {
            if (pointsToUpdate.includes(point.x)) {
              point.update({
                color: 'red',
              });
            }
          });
        },
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      title: {
        text: '',
      },
      labels: {
        style: {
          color: 'black',
          fontSize: '0.9em',
        },
      },
    },
    yAxis: {
      title: {
        text: '',
      },
      opposite: false,
      gridLineWidth: 0,
      labels: {
        style: {
          color: 'black',
          fontSize: '0.9em',
        },
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false,
        },
        enableMouseTracking: false,
        marker: false,
      },
    },
    series: [
      {
        data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1],
        showInLegend: false,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart;
