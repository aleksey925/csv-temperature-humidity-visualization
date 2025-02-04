import { Container, FileInput, Group, MantineProvider, Paper, Space, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import DateRangePicker from './component/DateRangePicker';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const parseCSV = (csv: string) => {
   const lines = csv.trim().split('\n');
   const headers = lines[0].split(';');
   const data = lines.slice(1).map(line => {
      const values = line.split(';');
      const entry: Record<string, string | number | Date> = {};
      headers.forEach((header, index) => {
         if (header === 'datetime') {
            entry[header] = new Date(values[index]);
         } else {
            entry[header] = parseFloat(values[index]);
         }
      });
      return entry;
   });
   return data;
};

function datetimeFormatter(tick: string): string {
   return dayjs(tick).format('YYYY.MM.DD HH:mm');
}

export default function App() {
   const [data, setData] = useState<any[]>([]);
   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

   const filteredData =
      dateRange[0] && dateRange[1]
         ? data.filter(entry => {
              const datetime = dayjs(entry.datetime);
              return (
                 datetime.isAfter(dayjs(dateRange[0]).startOf('day')) &&
                 (datetime.isBefore(dayjs(dateRange[1]).endOf('day')) ||
                    datetime.isSame(dayjs(dateRange[1]).endOf('day')))
              );
           })
         : data;

   const handleFileUpload = (file: File | null) => {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
         const text = e.target?.result as string;
         const parsedData = parseCSV(text);
         setData(parsedData);
      };
      reader.readAsText(file);
   };

   return (
      <MantineProvider>
         <Container my='lg'>
            <Group justify='space-between' align='center'>
               <Title order={1}>Home Climate Viewer</Title>

               {/* Новый компонент выбора диапазона дат */}
               <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            </Group>

            <Space h='md' />
            <FileInput
               label='Upload CSV file'
               placeholder='Click to upload'
               accept='.csv'
               onChange={file => handleFileUpload(file)}
            />

            <Space h='md' />
            {filteredData.length > 0 ? (
               <Paper shadow='xs' p='md' radius='md'>
                  <ResponsiveContainer width='100%' height={300}>
                     <LineChart data={filteredData} margin={{ top: 20 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='datetime' tickFormatter={datetimeFormatter} />
                        <YAxis />
                        <Tooltip labelFormatter={value => `Time: ${datetimeFormatter(value)}`} />
                        <Legend />
                        <Line
                           type='monotone'
                           dataKey='temperature'
                           stroke='#ff0000'
                           activeDot={{ r: 8 }}
                           name='Temperature (°C)'
                        />
                        <Line type='monotone' dataKey='humidity' stroke='#006eff' name='Humidity (%)' />
                     </LineChart>
                  </ResponsiveContainer>
               </Paper>
            ) : (
               <Text>Upload a CSV file and/or select a date range to visualize data.</Text>
            )}
         </Container>
      </MantineProvider>
   );
}
