
-- Trip members for group collaboration
CREATE TABLE public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id)
);

ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Members can see other members of trips they belong to
CREATE POLICY "Members can view trip members" ON public.trip_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid())
  );

CREATE POLICY "Owner can add members" ON public.trip_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid() AND tm.role = 'owner')
    OR (user_id = auth.uid()) -- user can join themselves
  );

CREATE POLICY "Owner can remove members" ON public.trip_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid() AND tm.role = 'owner')
    OR user_id = auth.uid() -- user can leave
  );

-- Activity votes
CREATE TABLE public.activity_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, activity_id, user_id)
);

ALTER TABLE public.activity_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view votes" ON public.activity_votes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = activity_votes.trip_id AND tm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.trips t WHERE t.id = activity_votes.trip_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Members can vote" ON public.activity_votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = activity_votes.trip_id AND tm.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.trips t WHERE t.id = activity_votes.trip_id AND t.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can change their vote" ON public.activity_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their vote" ON public.activity_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Expenses for split bill
CREATE TABLE public.trip_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  paid_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  category TEXT DEFAULT 'other' CHECK (category IN ('food', 'transport', 'hotel', 'ticket', 'shopping', 'other')),
  split_among UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.user_in_trip(_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members WHERE trip_id = _trip_id AND user_id = auth.uid()
    UNION
    SELECT 1 FROM public.trips WHERE id = _trip_id AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Trip participants can view expenses" ON public.trip_expenses
  FOR SELECT USING (public.user_in_trip(trip_id));

CREATE POLICY "Trip participants can add expenses" ON public.trip_expenses
  FOR INSERT WITH CHECK (auth.uid() = paid_by AND public.user_in_trip(trip_id));

CREATE POLICY "Payer can update expenses" ON public.trip_expenses
  FOR UPDATE USING (auth.uid() = paid_by);

CREATE POLICY "Payer can delete expenses" ON public.trip_expenses
  FOR DELETE USING (auth.uid() = paid_by);

-- Update trips RLS to allow trip members to view shared trips
CREATE POLICY "Members can view shared trips" ON public.trips
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trip_members tm WHERE tm.trip_id = trips.id AND tm.user_id = auth.uid())
  );
