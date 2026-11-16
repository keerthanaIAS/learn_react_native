
import api from './api';

export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
}

// GET - Fetch all students
export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

// GET - Fetch a single student by ID
export const getStudent = async (id: number) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

// POST - Add a student
export const addStudent = async (student: Omit<Student, 'id'>) => {
  const response = await api.post('/students', student);
  return response.data;
};

// PUT - Update student
export const updateStudent = async (
  id: number,
  student: Omit<Student, 'id'>
) => {
  const response = await api.put(`/students/${id}`, student);
  return response.data;
};

// DELETE - Remove student
export const deleteStudent = async (id: number) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
