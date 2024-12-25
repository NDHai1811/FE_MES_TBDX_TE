import { Card } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Highcharts from "highcharts";

const TyLeKeHoachIn = ({data = null, loading = false}) => {    
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
                text: "Tỷ lệ kế hoạch/In",
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
                    name: 'SLg KH',
                    data: data.plannedQuantity
                },
                {
                    name: 'SLg In',
                    data: data.actualQuantity
                }
            ],
            exporting: false,
            credits: { enabled: false }
        };

        Highcharts.chart("ty-le-ke-hoach-in-chart", options);
    }, [data]);
    return (
        <Card
            style={{ padding: "0px"}}
            styles={{body: {padding: 8}}}
            loading={loading}
        >
            <div id="ty-le-ke-hoach-in-chart" />
        </Card>
    )
}

export default TyLeKeHoachIn;