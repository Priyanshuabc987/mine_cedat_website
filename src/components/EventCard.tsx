
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  isUpcoming?: boolean;
}

export function EventCard({ title, date, location, imageUrl, category, isUpcoming }: EventCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl group h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isUpcoming && (
          <Badge className="absolute top-4 right-4 bg-secondary hover:bg-secondary">
            Upcoming
          </Badge>
        )}
      </div>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
          <span className="font-semibold text-primary uppercase tracking-wider">{category}</span>
        </div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            {date}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {location}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-all">
          <Link href={`/events/register`}>
            Register Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
