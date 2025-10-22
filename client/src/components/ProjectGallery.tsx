import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useFloorPlan } from '../lib/stores/useFloorPlan';
import { templateFloorPlans } from '../lib/template-data';
import { FolderOpen, Trash2, Clock, Home } from 'lucide-react';

export function ProjectGallery() {
  const { savedPlans, loadPlan, deletePlan } = useFloorPlan();
  
  const allProjects = [
    ...templateFloorPlans.map(plan => ({ ...plan, isTemplate: true })),
    ...savedPlans.map(plan => ({ ...plan, isTemplate: false }))
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="w-5 h-5" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {allProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No projects yet</p>
                <p className="text-xs">Create your first floor plan!</p>
              </div>
            ) : (
              allProjects.map(project => (
                <Card key={project.id} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={project.isTemplate ? "secondary" : "default"} className="text-xs">
                            {project.isTemplate ? 'Template' : 'Saved'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.isTemplate ? 'Template' : `Modified ${formatDate(project.modified)}`}
                      </div>
                      <div>
                        {project.rooms.length} rooms • {project.furniture.length} items
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => loadPlan(project.id)}
                        className="flex-1 text-xs"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Load
                      </Button>
                      
                      {!project.isTemplate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this project?')) {
                              deletePlan(project.id);
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
