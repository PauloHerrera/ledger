//Just to use as reference for now

"use client";

import { MoreHorizontal, ArrowUpDown, Search, Filter } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

// Sample data
const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
    lastLogin: "2024-01-14",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "2024-01-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    role: "Editor",
    status: "Active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-13",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "6",
    name: "Frank Brown",
    email: "frank@example.com",
    role: "Viewer",
    status: "Pending",
    lastLogin: "Never",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    case "Inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "Pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Admin":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      );
    case "Editor":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Editor
        </Badge>
      );
    case "Viewer":
      return <Badge variant="outline">Viewer</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default function BeautifulTable() {
  return (
    <div className=" mx-auto py-8 px-4 space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold m-3">Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their account permissions here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <Button>Add Member</Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                    >
                      Member
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                    >
                      Role
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold"
                    >
                      Last Login
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit member</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1-6 of 6 members
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
