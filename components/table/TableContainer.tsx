'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import CoursesTable from '../courses/CoursesTable';
import CourseInstancesTable from '../courseInstances/CourseInstancesTable';
import LocationsTable from '../locations/LocationsTable';
import InstructorsTable from '../instructors/InstructorsTable';
import StudentsTable from '../students/StudentsTable';

const TableContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get('tab') ?? 'students';

  const handleTabChange = (value: string) => {
    router.replace(`?tab=${value}`);
  };

  return (
    <div className='w-full max-w-400 grow text-accent-foreground'>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value='courses'>Courses</TabsTrigger>
          <TabsTrigger value='courseInstances'>CourseInstances</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
          <TabsTrigger value='instructors'>Instructors</TabsTrigger>
          <TabsTrigger value='students'>Students</TabsTrigger>
        </TabsList>

        <TabsContent value='courses'>
          <CoursesTable />
        </TabsContent>

        <TabsContent value='courseInstances'>
          <CourseInstancesTable />
        </TabsContent>

        <TabsContent value='locations'>
          <LocationsTable />
        </TabsContent>

        <TabsContent value='instructors'>
          <InstructorsTable />
        </TabsContent>

        <TabsContent value='students'>
          <StudentsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableContainer;
