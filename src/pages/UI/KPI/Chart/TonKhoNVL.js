import { Card } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Highcharts from "highcharts";

const TonKhoNVL = ({data = null, loading = false}) => {    
    useEffect(() => {
        if (!data) {
            return;
        }
        const options = {
            chart: {
                height: 300,
                type: 'column',
            },
            title: {
                text: "Tồn kho NVL",
                style: {
                    fontSize: '16px', // Kích thước font nhỏ hơn
                }
            },
            xAxis: {
                categories: data.categories,
                title: false
            },
            yAxis: {
                min: 0,
                title: false
            },
            plotOptions: {
                column: {
                    borderRadius: 0,
                    dataLabels: {
                        enabled: true,
                    },
                }
            },
            series: [
                {
                    name: 'Số kg tồn kho',
                    data: data.inventory
                },
            ],
            exporting: false,
            credits: { enabled: false }
        };

        Highcharts.chart("ton-kho-nvl-chart", options);
    }, [data]);
    return (
        <Card
            style={{ padding: "0px"}}
            styles={{body: {padding: 8}}}
            loading={loading}
        >
            <div id="ton-kho-nvl-chart" />
        </Card>
    )
}

export default TonKhoNVL;