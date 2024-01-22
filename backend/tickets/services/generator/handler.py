import logging


class Handler:
    @staticmethod
    def make_from_env():
        logging.basicConfig()
        logging.getLogger().setLevel(logging.INFO)

        return Handler()

    def handle(self, event, _context):
        logging.info("event: %s" % event)

        # parsed_events = Event.parse(event)

        # self.handle_events(parsed_events)

    def handle_events(self, events: list[dict]):
        pass
