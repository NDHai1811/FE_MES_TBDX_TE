import { Card } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Highcharts from "highcharts";

const TanSuatPhatSinhLoi = ({data = null, loading = false}) => {    
    useEffect(() => {
        if (!data) {
            return;
        }
        const series = [
            {
                name: 'Số lỗi',
                colorByPoint: true,
                data: data.map(e=>({...e, y: e.value, name: e.name}))
            }
        ]
        const options = {
            chart: {
                type: 'pie',
                height: 200,
            },
            title: false,
            series: series,
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: [{
                        enabled: true,
                        distance: 5
                    }, {
                        enabled: false,
                    }]
                }
            },
            exporting: false,
            credits: { enabled: false }
        };

        Highcharts.chart("tan-suat-phat-sinh-loi-chart", options);
    }, [data]);
    return (
        <Card
            style={{ padding: "0px"}}
            styles={{body: {padding: 8}}}
            loading={loading}
            title="Tần suất phát sinh lỗi"
        >
            <div id="tan-suat-phat-sinh-loi-chart" />
        </Card>
    )
}

export default TanSuatPhatSinhLoi;