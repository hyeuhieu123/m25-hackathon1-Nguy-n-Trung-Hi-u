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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const employees = await getEmployees();

  if (email) {
    const employee = employees.find((e: any) => e.email === email);
    return employee
      ? NextResponse.json(employee)
      : NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const employees = await getEmployees();
  const newEmployee = await request.json();

  if (employees.some((e: any) => e.email === newEmployee.email)) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  newEmployee.id =
    employees.length > 0 ? Math.max(...employees.map((e: any) => e.id)) + 1 : 1;
  employees.push(newEmployee);
  await saveEmployees(employees);

  return NextResponse.json(newEmployee, { status: 201 });
}
