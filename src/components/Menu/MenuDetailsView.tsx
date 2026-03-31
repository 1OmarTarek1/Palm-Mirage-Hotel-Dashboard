import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "./data";

interface MenuDetailsViewProps {
  item: MenuItem;
}

const MenuDetailsView: React.FC<MenuDetailsViewProps> = ({ item }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Name
            </h4>
            <p className="mt-1 text-lg font-medium">{item.name}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Price
            </h4>
            <p className="mt-1 text-xl font-bold text-primary">${item.price}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </h4>
            <div className="mt-1">
              <Badge variant={item.available ? "success" : "destructive"}>
                {item.available ? "Available" : "Not Available"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description || "No description provided."}
            </p>
          </div>

          {item.categoryHeroImg && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category Hero Image
              </h4>
              <div className="relative mt-2 aspect-[3/1] w-full overflow-hidden rounded-lg border border-border">
                <Image
                  src={item.categoryHeroImg}
                  alt="Category Hero"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuDetailsView;
