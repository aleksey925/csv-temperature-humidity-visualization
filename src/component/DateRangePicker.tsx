import { Button, Divider, Stack, Text, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useState } from 'react';

type RangePreset = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days';
interface DateRangePickerProps {
   dateRange: [Date | null, Date | null];
   setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, setDateRange }) => {
   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

   const setPresetRange = (range: RangePreset) => {
      const rangeToDaysOffset: Record<RangePreset, Record<'start' | 'end', number>> = {
         today: { start: 0, end: 0 },
         yesterday: { start: 1, end: 1 },
         last_7_days: { start: 7, end: 0 },
         last_30_days: { start: 30, end: 0 },
      };
      const now = dayjs();
      setDateRange([
         now.subtract(rangeToDaysOffset[range]['start'], 'day').startOf('day').toDate(),
         now.subtract(rangeToDaysOffset[range]['end'], 'day').endOf('day').toDate(),
      ]);
      setIsPopoverOpen(false);
   };

   return (
      <Popover opened={isPopoverOpen} onChange={setIsPopoverOpen} position='bottom' withArrow shadow='md'>
         <Popover.Target>
            <Text
               variant='link'
               style={{ cursor: 'pointer', color: '#1d72b8' }}
               onClick={() => setIsPopoverOpen(prev => !prev)}>
               {dateRange[0] && dateRange[1]
                  ? `${dayjs(dateRange[0]).format('YYYY.MM.DD')} - ${dayjs(dateRange[1]).format('YYYY.MM.DD')}`
                  : 'Select Date Range'}
            </Text>
         </Popover.Target>

         <Popover.Dropdown>
            <div style={{ display: 'flex', gap: '16px' }}>
               <div style={{ flex: 1 }}>
                  <DatePicker type='range' value={dateRange} onChange={setDateRange} />
               </div>

               <Divider orientation='vertical' />

               <div style={{ flexBasis: '200px' }}>
                  <Stack gap='xs'>
                     <Button variant='outline' onClick={() => setPresetRange('today')}>
                        Today
                     </Button>
                     <Button variant='outline' onClick={() => setPresetRange('yesterday')}>
                        Yesterday
                     </Button>
                     <Button variant='outline' onClick={() => setPresetRange('last_7_days')}>
                        Last 7 Days
                     </Button>
                     <Button variant='outline' onClick={() => setPresetRange('last_30_days')}>
                        Last 30 Days
                     </Button>
                     <Button
                        variant='outline'
                        color='red'
                        onClick={() => {
                           setDateRange([null, null]);
                           setIsPopoverOpen(false);
                        }}>
                        Reset
                     </Button>
                     <Button variant='default' color='gray' onClick={() => setIsPopoverOpen(false)}>
                        Close
                     </Button>
                  </Stack>
               </div>
            </div>
         </Popover.Dropdown>
      </Popover>
   );
};

export default DateRangePicker;
