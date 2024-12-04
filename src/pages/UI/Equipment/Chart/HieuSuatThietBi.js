import { Card } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Highcharts from "highcharts";

const HieuSuatThietBi = ({data = null, loading = false}) => {    
    useEffect(() => {
        if (!data) {
            return;
        }
        const categories = data.map(e=>e.name);
        const percents = data.map(e=>e.percent)
        const options = {
            chart: {
                height: 200,
                type: 'column',
            },
            title: false,
            xAxis: {
                categories: categories,
                title: false
            },
            yAxis: {
                min: 0,
                title: false,
                labels: {
                    format: '{value}%',
                },
                minRange: 10,
            },
            plotOptions: {
                column: {
                    borderRadius: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{y}%'
                    },
                }
            },
            series: [
                {
                    name: 'Hiệu suất',
                    data: percents
                },
            ],
            exporting: false,
            credits: { enabled: false }
        };

        Highcharts.chart("hieu-suat-thiet-bi-chart", options);
    }, [data]);
    return (
        <Card
            style={{ padding: "0px"}}
            styles={{body: {padding: 8}}}
            loading={loading}
            title="Hiệu suất thiết bị"
        >
            <div id="hieu-suat-thiet-bi-chart" />
        </Card>
    )
}

export default HieuSuatThietBi;