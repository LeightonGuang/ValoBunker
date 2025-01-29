"use client";

import { Image } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { MapsTableType } from "@/types/MapsTableType";

const MapPage = () => {
  const mapName = useParams().name;
  const [isLoading, setLoading] = useState(true);
  const [mapData, setMapData] = useState<MapsTableType>({} as MapsTableType);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: mapData, error: mapError } = await supabase
        .from("maps")
        .select("*")
        .eq("name", mapName)
        .single();

      if (mapError) {
        console.error(mapError);
      } else {
        console.log(mapData);
        setMapData(mapData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <div>
        <h1 className={title()}>{mapName}</h1>

        {!isLoading && (
          <div className="mt-4 flex w-full justify-center">
            <div className="flex flex-col">
              <Image
                alt={mapData.name}
                className="h-64 w-full rounded-none"
                isLoading={isLoading}
                src={mapData.cover_img_url}
              />

              <Image
                alt={mapData.name}
                className="aspect-auto h-64 rounded-none"
                isLoading={isLoading}
                src={mapData.mini_map_url}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapPage;
