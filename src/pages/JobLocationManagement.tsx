import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../components/ui/use-toast';

interface JobLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  assignedEmployees: string[];
}

interface NewLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const JobLocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<JobLocation[]>([]);
  const [newLocation, setNewLocation] = useState<NewLocation>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const parsedLocations = parseCSV(csvData);
      setLocations((prev) => [...prev, ...parsedLocations]);
      toast({
        title: "Success",
        description: "Locations imported successfully",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleAddLocation = () => {
    const location: JobLocation = {
      id: Math.random().toString(36).substr(2, 9),
      ...newLocation,
      assignedEmployees: [],
    };
    setLocations((prev) => [...prev, location]);
    setNewLocation({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    });
    toast({
      title: "Success",
      description: "Location added successfully",
    });
  };

  const parseCSV = (csvData: string): JobLocation[] => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line) => {
      const values = line.split(',');
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: values[0] || '',
        address: values[1] || '',
        city: values[2] || '',
        state: values[3] || '',
        zipCode: values[4] || '',
        assignedEmployees: [],
      };
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Job Location Management</h1>

      {/* Add New Location Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="Location Name"
            value={newLocation.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewLocation({ ...newLocation, name: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={newLocation.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewLocation({ ...newLocation, address: e.target.value })}
          />
          <Input
            placeholder="City"
            value={newLocation.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewLocation({ ...newLocation, city: e.target.value })}
          />
          <Input
            placeholder="State"
            value={newLocation.state}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewLocation({ ...newLocation, state: e.target.value })}
          />
          <Input
            placeholder="ZIP Code"
            value={newLocation.zipCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewLocation({ ...newLocation, zipCode: e.target.value })}
          />
          <Button onClick={handleAddLocation}>Add Location</Button>
        </div>
      </div>

      {/* CSV Import Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Import Locations</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Choose CSV File
          </label>
          <p className="text-sm text-gray-500 mt-2">
            CSV should contain: name, address, city, state, zipCode
          </p>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>ZIP Code</TableHead>
              <TableHead>Assigned Employees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.city}</TableCell>
                <TableCell>{location.state}</TableCell>
                <TableCell>{location.zipCode}</TableCell>
                <TableCell>{location.assignedEmployees.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobLocationManagement;
