import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useUser } from '../../contexts/UserContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DeviceDetailsModal = ({ 
    name, 
    location, 
    uuid, 
    battery, 
    deviceType, 
    onClose,
    additionalData = {} 
}) => {
    // Set default dates: last 7 days
    const getDefaultDates = () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // 7 days ago
        return { startDate, endDate };
    };

    const { startDate: defaultStartDate, endDate: defaultEndDate } = getDefaultDates();
    
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    
    const { getUserId } = useUser();

    // Fetch initial data when component mounts
    useEffect(() => {
        fetchChartData();
    }, []); // Empty dependency array means this runs once on mount

    const fetchChartData = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        if (startDate >= endDate) {
            alert('Start date must be before end date');
            return;
        }

        setIsLoading(true);
        try {
            // Format dates for API call - backend expects "yyyy-MM-dd HH:mm:ss" format
            const formatDateForBackend = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            const formattedStartDate = formatDateForBackend(startDate);
            const formattedEndDate = formatDateForBackend(endDate);
            
            console.log('Fetching chart data for:', {
                uuid,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                deviceType
            });

            // Determine the type parameter based on device type
            // Backend expects exact device type names: LedControl, GasSensor, TemperatureSensor, Relay
            const getTypeParameter = () => {
                switch (deviceType) {
                    case 'GasSensor':
                        return 'GasSensor';
                    case 'LedControl':
                        return 'LedControl';
                    case 'TemperatureSensor':
                        return 'TemperatureSensor';
                    case 'Relay':
                        return 'Relay';
                    default:
                        return 'GasSensor'; // fallback
                }
            };

            // Build query parameters
            const params = new URLSearchParams({
                id_user: getUserId(), // Get user ID from context
                uuid: uuid,
                date_start: formattedStartDate,
                date_end: formattedEndDate,
                type: getTypeParameter()
            });

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/Peripheral/getAggregatedData?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch chart data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Validate the response data
            if (!Array.isArray(data)) {
                console.warn('API returned non-array data:', data);
                // If it's an object with a data property, use that
                if (data && Array.isArray(data.data)) {
                    setChartData(data.data);
                } else {
                    // Otherwise, wrap it in an array or set empty array
                    setChartData([]);
                }
            } else {
                setChartData(data);
            }
            
            console.log('Chart data received:', data);
            
        } catch (error) {
            console.error('Error fetching chart data:', error);
            alert(`Failed to fetch chart data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to prepare data for Chart.js
    const prepareChartData = () => {
        if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
            return null;
        }

        const labels = chartData.map((item, index) => {
            const date = new Date(item.timestamp);
            
            // Check if we have multiple data points with the same timestamp
            const sameTimestamps = chartData.filter(d => d.timestamp === item.timestamp).length;
            
            if (sameTimestamps > 1) {
                // If multiple points have same timestamp, add sequence number
                const sequenceNumber = chartData.slice(0, index + 1).filter(d => d.timestamp === item.timestamp).length;
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            } else {
                // Show full date and time for unique timestamps
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            }
        });

        let datasetLabel, dataValues, borderColor, backgroundColor;

        switch (deviceType) {
            case 'TemperatureSensor':
                datasetLabel = 'Temperature (°C)';
                dataValues = chartData.map(item => item.temperature);
                borderColor = 'rgb(255, 99, 132)';
                backgroundColor = 'rgba(255, 99, 132, 0.2)';
                break;
            case 'GasSensor':
                datasetLabel = 'Gas Level (ppm)';
                dataValues = chartData.map(item => item.ppm);
                borderColor = 'rgb(255, 159, 64)';
                backgroundColor = 'rgba(255, 159, 64, 0.2)';
                break;
            case 'LedControl':
                datasetLabel = 'Brightness (%)';
                dataValues = chartData.map(item => item.brightness);
                borderColor = 'rgb(255, 205, 86)';
                backgroundColor = 'rgba(255, 205, 86, 0.2)';
                break;
            case 'Relay':
                datasetLabel = 'State';
                dataValues = chartData.map(item => item.state ? 1 : 0);
                borderColor = 'rgb(75, 192, 192)';
                backgroundColor = 'rgba(75, 192, 192, 0.2)';
                break;
            default:
                datasetLabel = 'Value';
                dataValues = chartData.map(item => 0);
                borderColor = 'rgb(153, 102, 255)';
                backgroundColor = 'rgba(153, 102, 255, 0.2)';
        }

        return {
            labels,
            datasets: [
                {
                    label: datasetLabel,
                    data: dataValues,
                    borderColor,
                    backgroundColor,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                }
            ]
        };
    };

    // Chart.js options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: `${name} - ${deviceType} Data`,
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (deviceType === 'Relay') {
                            label += context.parsed.y === 1 ? 'ON' : 'OFF';
                        } else {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    // Limit to max 15 visible ticks to prevent clustering
                    maxTicksLimit: 15,
                    callback: function(value, index, values) {
                        // Show every nth tick to avoid overcrowding
                        const totalTicks = values.length;
                        if (totalTicks <= 15) {
                            return this.getLabelForValue(value);
                        }
                        
                        // Calculate step to show approximately 15 ticks
                        const step = Math.ceil(totalTicks / 15);
                        if (index % step === 0 || index === totalTicks - 1) {
                            return this.getLabelForValue(value);
                        }
                        return '';
                    }
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: (() => {
                        switch (deviceType) {
                            case 'TemperatureSensor': return 'Temperature (°C)';
                            case 'GasSensor': return 'Gas Level (ppm)';
                            case 'LedControl': return 'Brightness (%)';
                            case 'Relay': return 'State (0=OFF, 1=ON)';
                            default: return 'Value';
                        }
                    })()
                },
                beginAtZero: deviceType === 'Relay' || deviceType === 'LedControl',
                min: deviceType === 'Relay' ? 0 : undefined,
                max: deviceType === 'Relay' ? 1 : (deviceType === 'LedControl' ? 100 : undefined),
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const preparedData = prepareChartData();

    return (
        <div style={{ 
            height: '100%', 
            width: '100%',
            position: 'relative',
            backgroundColor: 'var(--warm-beige)',
            padding: '20px'
        }}>
            {/* Controls in top-left corner */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'var(--desert-sand)',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid var(--deep-brown)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minWidth: '280px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                {/* Start Date */}
                <div>
                    <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: 'var(--deep-brown)', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                    }}>
                        Start Date
                    </label>
                    <Calendar
                        value={startDate}
                        onChange={(e) => setStartDate(e.value)}
                        showTime
                        hourFormat="24"
                        placeholder="Select start date"
                        style={{ width: '100%' }}
                        inputStyle={{
                            backgroundColor: 'var(--warm-beige)',
                            border: '1px solid var(--deep-brown)',
                            borderRadius: '5px',
                            color: 'var(--deep-brown)',
                            padding: '8px',
                            fontSize: '0.85rem',
                            width: '100%'
                        }}
                        panelStyle={{
                            backgroundColor: 'var(--warm-beige)',
                            border: '2px solid var(--deep-brown)'
                        }}
                    />
                </div>

                {/* End Date */}
                <div>
                    <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: 'var(--deep-brown)', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                    }}>
                        End Date
                    </label>
                    <Calendar
                        value={endDate}
                        onChange={(e) => setEndDate(e.value)}
                        showTime
                        hourFormat="24"
                        placeholder="Select end date"
                        style={{ width: '100%' }}
                        inputStyle={{
                            backgroundColor: 'var(--warm-beige)',
                            border: '1px solid var(--deep-brown)',
                            borderRadius: '5px',
                            color: 'var(--deep-brown)',
                            padding: '8px',
                            fontSize: '0.85rem',
                            width: '100%'
                        }}
                        panelStyle={{
                            backgroundColor: 'var(--warm-beige)',
                            border: '2px solid var(--deep-brown)'
                        }}
                    />
                </div>

                {/* Fetch Button */}
                <Button
                    label={isLoading ? "Fetching..." : "Update Chart"}
                    icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
                    onClick={fetchChartData}
                    disabled={isLoading || !startDate || !endDate}
                    size="small"
                    style={{
                        backgroundColor: isLoading ? 'var(--muted-olive)' : 'var(--deep-brown)',
                        border: '1px solid var(--deep-brown)',
                        color: 'var(--warm-beige)',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        borderRadius: '5px',
                        width: '100%'
                    }}
                />
            </div>

            {/* Chart Display Area */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '320px', // Leave space for controls
                right: '20px',
                bottom: '20px',
                backgroundColor: 'var(--soft-amber)',
                borderRadius: '15px',
                border: '2px solid var(--deep-brown)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--deep-brown)'
                    }}>
                        <i className="pi pi-spin pi-spinner" style={{ 
                            fontSize: '3rem', 
                            marginBottom: '20px' 
                        }}></i>
                        <h3>Loading Chart Data...</h3>
                        <p>Fetching data for {name}</p>
                    </div>
                ) : preparedData ? (
                    // Chart with Chart.js
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--warm-beige)',
                        borderRadius: '10px',
                        border: '1px solid var(--deep-brown)',
                        padding: '20px',
                        position: 'relative'
                    }}>
                        <Line data={preparedData} options={chartOptions} />
                    </div>
                ) : (
                    // No data message
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--deep-brown)'
                    }}>
                        <i className="pi pi-info-circle" style={{ 
                            fontSize: '3rem', 
                            marginBottom: '20px',
                            opacity: 0.5 
                        }}></i>
                        <h3 style={{ 
                            fontSize: '1.3rem',
                            marginBottom: '10px',
                            opacity: 0.7 
                        }}>
                            No Data Available
                        </h3>
                        <p style={{ 
                            fontSize: '1rem',
                            opacity: 0.6 
                        }}>
                            No data found for the selected time period
                        </p>
                        {/* Debug info if needed */}
                        {chartData && !Array.isArray(chartData) && (
                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: 'var(--desert-sand)',
                                borderRadius: '8px',
                                border: '1px solid var(--deep-brown)',
                                fontSize: '0.9rem',
                                maxWidth: '500px',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                <strong>Debug Info:</strong>
                                <pre style={{ 
                                    margin: '10px 0 0 0',
                                    fontSize: '0.8rem',
                                    textAlign: 'left'
                                }}>
                                    {JSON.stringify(chartData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceDetailsModal;