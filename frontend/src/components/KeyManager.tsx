import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { AddKeyForm } from "./forms/AddKeyForm";
import { SearchKeys } from "./forms/SearchKeys";
import { UpdateKey } from "./forms/UpdateKey";
import { DeleteKeys } from "./forms/DeleteKeys";
import { KeyEntry } from "../types";

export default function KeyManager() {
  const [entries, setEntries] = useState<KeyEntry[]>([]);

  const addEntry = (key: string, value: string, tags: string[]) => {
    const newEntry: KeyEntry = {
      id: Date.now().toString(),
      key,
      value,
      tags,
      createdAt: Date.now(),
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, key: string, value: string, tags: string[]) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, key, value, tags } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="update">Update</TabsTrigger>
                <TabsTrigger value="delete">Delete</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add">
                <AddKeyForm onAdd={addEntry} />
              </TabsContent>
              
              <TabsContent value="search">
                <SearchKeys entries={entries} />
              </TabsContent>
              
              <TabsContent value="update">
                <UpdateKey entries={entries} onUpdate={updateEntry} />
              </TabsContent>
              
              <TabsContent value="delete">
                <DeleteKeys entries={entries} onDelete={deleteEntry} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
