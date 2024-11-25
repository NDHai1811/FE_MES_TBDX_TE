import { Card } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Highcharts from "highcharts";

const TyLeVanHanhThietBi = ({data = null, loading = false}) => {    
    useEffect(() => {
        if (!data) {
            return;
        }
        const options = {
            chart: {
                height: 300,
                type: 'line',
            },
            title: {
                text: "Tỷ lệ vận hành thiết bị",
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
                title: false,
                labels: {
                    format: '{value}%',
                },
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                        format: '{y}%'  
                    },
                    lineWidth: 2,
                    marker: {
                        radius: 0,
                    },
                },
            },
            series: [
                {
                    name: 'Tỷ lệ vận hành',
                    data: data.ti_le_van_hanh
                },
            ],
            exporting: false,
            credits: { enabled: false }
        };

        Highcharts.chart("ty-le-van-hanh-thiet-bi-chart", options);
    }, [data]);
    return (
        <Card
            style={{ padding: "0px"}}
            styles={{body: {padding: 8}}}
            loading={loading}
        >
            <div id="ty-le-van-hanh-thiet-bi-chart" />
        </Card>
    )
}

export default TyLeVanHanhThietBi;