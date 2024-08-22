import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "database", "employees.json");

async function getEmployees() {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

async function saveEmployees(employees: any[]) {
  await fs.writeFile(dbPath, JSON.stringify(employees, null, 2));
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const employees = await getEmployees();
  const employee = employees.find((e: any) => e.id === id);

  return employee
    ? NextResponse.json(employee)
    : NextResponse.json({ error: "Employee not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const updatedEmployee = await request.json();

  const employees = await getEmployees();
  const index = employees.findIndex((e: any) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  employees[index] = { ...employees[index], ...updatedEmployee, id };
  await saveEmployees(employees);

  return NextResponse.json(employees[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const employees = await getEmployees();
  const filteredEmployees = employees.filter((e: any) => e.id !== id);

  if (filteredEmployees.length === employees.length) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  await saveEmployees(filteredEmployees);
  return NextResponse.json({ message: "Employee deleted successfully" });
}
