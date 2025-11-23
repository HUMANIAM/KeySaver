import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Card, CardContent } from "../../shared/ui/card";
import { AddKeyForm } from "./AddKeyForm";
import { SearchKeys } from "./SearchKeys";
import { UpdateKey } from "./UpdateKey";
import { DeleteKeys } from "./DeleteKeys";
import { useKeys } from "./useKeys";

export default function KeyManager() {
  const { entries, loading, error, addKey, updateKey, deleteKey, refreshKeys } = useKeys();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshKeys}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                <AddKeyForm onAdd={addKey} entries={entries} />
              </TabsContent>
              
              <TabsContent value="search">
                <SearchKeys entries={entries} />
              </TabsContent>
              
              <TabsContent value="update">
                <UpdateKey entries={entries} onUpdate={updateKey} />
              </TabsContent>
              
              <TabsContent value="delete">
                <DeleteKeys entries={entries} onDelete={deleteKey} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
